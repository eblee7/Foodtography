const { ApolloServer, gql } = require("apollo-server");
const mongoCollections = require("./config/mongoCollections");
const uuid = require("uuid"); //for generating _id's
const redis = require("redis");
const bluebird = require("bluebird");
const client = redis.createClient();
const axios = require("axios");
const AWS = require("aws-sdk");
const im = require("imagemagick");
const fs = require("fs");
const xss = require("xss");
require("dotenv").config();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

if (process.platform == "win32") {
    im.convert.path = "C:/Program Files/ImageMagick-7.1.0-Q16-HDRI/convert";
    im.identify.path = "C:/Program Files/ImageMagick-7.1.0-Q16-HDRI/identify";
}

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3({ region: process.env.AWS_REGION });
const s3DefaultParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Conditions: [
        ["content-length-range", 0, 1024000], // 1 Mb
    ],
};

//Some Mock Data
const restaurantsCollection = mongoCollections.restaurants;
const imagesCollection = mongoCollections.images;

const apiKey = process.env.GOOGLE_API_KEY;

//Create the type definitions for the query and our data
const typeDefs = gql`
    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }

    type Query {
        restaurantsNearby(address: String!): Nearby
        restaurant(rid: ID!): Restaurant
        restaurantImages(rid: ID!, food: Boolean!): [ImagePost]
        userImages(userID: ID!): [ImagePost]
        image(imageID: ID!): ImagePost
        images: [ImagePost]
    }

    type ImagePost {
        _id: ID!
        url: String!
        description: String
        food: Boolean!
        rid: ID!
        userName: String!
        userID: ID!
        comments: [Comment]
    }

    type Comment {
        userName: String!
        comment: String!
    }

    type Location {
        vicinity: String!
        latitude: Float!
        longitude: Float!
    }

    type S3Object {
        ETag: String
        Location: String!
        Key: String!
        Bucket: String!
    }

    type Restaurant {
        _id: ID!
        name: String!
        url: String!
        location: Location!
    }

    type Details {
        name: String!
        location: Location!
    }

    type Nearby {
        address: String!
        nearest: [Restaurant]
    }

    type Mutation {
        uploadImage(
            file: Upload!
            food: Boolean!
            description: String
            rid: ID!
            userName: String!
            userID: ID!
        ): ImagePost
        addComment(userName: String!, imageID: ID!, comment: String!): Comment
    }
`;
// Update Image and Delete Image

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
		
*/

const resolvers = {
    Query: {
        restaurant: async (_, args) => {
            let place_id = xss(args.rid);
            if (!place_id || !place_id.trim()) throw "Invalid rid";

            let exist = await client.existsAsync(place_id + "Details");
            if (exist) {
                console.log("from redis");
                let placeDetailsJSON = await client.getAsync(
                    place_id + "Details"
                );
                return JSON.parse(placeDetailsJSON);
            } else {
                try {
                    var config = {
                        method: "get",
                        url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${apiKey}`,
                        headers: {},
                    };
                    let { data } = await axios(config);
                    let newRestaurant = {
                        _id: data.result.place_id,
                        name: data.result.name,
                        location: {
                            vicinity: data.result.formatted_address,
                            latitude: data.result.geometry.location.lat,
                            longitude: data.result.geometry.location.lng,
                        },
                    };
                    await client.setAsync(
                        place_id + "Details",
                        JSON.stringify(newRestaurant)
                    );
                    return newRestaurant;
                } catch (e) {
                    console.log(e);
                    throw {
                        error: e,
                    };
                }
            }
        },
        restaurantImages: async (_, args) => {
            let rid = xss(args.rid);
            let food = xss(args.food);
            if (!rid || !rid.trim()) throw "Invalid rid";
            food = food === "true" ? true : false;
            const images = await imagesCollection();
            const allimages = await images
                .find({ rid: rid, food: food })
                .toArray();
            if (!allimages) throw "Could not get restaurant images";
            return allimages;
        },
        images: async (_, args) => {
            const images = await imagesCollection();
            const allimages = await images.find({}).toArray();
            if (!allimages) throw "Could not get all images";
            return allimages;
        },
        userImages: async (_, args) => {
            let userID = xss(args.userID);
            if (!userID || !userID.trim()) throw "Invalid userID";
            const images = await imagesCollection();
            const allimages = await images.find({ userID: userID }).toArray();
            if (!allimages) throw "Could not get user images";

            return allimages;
        },
        restaurantsNearby: async (_, args) => {
            let address = xss(args.address);
            if (!address || !address.trim()) throw "Invalid address";
            if (!address || !address.trim()) {
                throw "No Address Provided";
            }
            var config = {
                method: "get",
                url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${address}&inputtype=textquery&fields=formatted_address%2Cplace_id%2Cname%2Cgeometry&key=${apiKey}`,
                headers: {},
            };
            try {
                let response = await axios(config);
                console.log("axios1");
                if (response.data.candidates.length === 0) {
                    throw "Not Found";
                }
                let data = response.data.candidates[0];
                let addressVicinity = data.formatted_address;

                let exists = await client.existsAsync(data.place_id + "NearBy");
                if (exists) {
                    console.log("redis!");
                    const nearbyPlacesJSON = await client.getAsync(
                        data.place_id + "NearBy"
                    );
                    let nearbyPlaces = JSON.parse(nearbyPlacesJSON);
                    return {
                        address: addressVicinity,
                        nearest: nearbyPlaces,
                    };
                } else {
                    config.url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?&location=${data.geometry.location.lat}%2C${data.geometry.location.lng}&radius=1500&type=restaurant&key=${apiKey}`;
                    response = await axios(config);
                    console.log("axios2");
                    nearbyData = response.data.results;
                    let places = nearbyData.map((place) => {
                        return {
                            _id: place.place_id,
                            name: place.name,
                            location: {
                                vicinity: place.vicinity,
                                latitude: place.geometry.location.lat,
                                longitude: place.geometry.location.lng,
                            },
                        };
                    });
                    for (let i = 0; i < nearbyData.length; i++) {
                        if (nearbyData[i].photos) {
                            let reference =
                                nearbyData[i].photos[0].photo_reference;
                            // mongo to check to see if this id is in the res collection and has the url if it doesnt then u make the call and store
                            const restaurants = await restaurantsCollection();
                            const restaurantResult = await restaurants.findOne({
                                _id: nearbyData[i].place_id,
                            });
                            if (restaurantResult === null) {
                                config.url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${reference}&key=${apiKey}`;
                                let photoData = await axios(config);
                                console.log("axios3");
                                places[i].url =
                                    photoData.request.res.responseUrl;
                                const newRestaurant = {
                                    _id: places[i]._id,
                                    url: places[i].url,
                                };
                                await restaurants.insertOne(newRestaurant);
                            } else {
                                console.log("from mongo");
                                places[i].url = restaurantResult.url;
                            }
                        } else {
                            places[i].url = "";
                        }
                    }
                    let searchResults = {
                        address: addressVicinity,
                        nearest: places,
                    };
                    await client.setAsync(
                        data.place_id + "NearBy",
                        JSON.stringify(places)
                    );
                    return searchResults;
                }
            } catch (e) {
                console.log(e);
                throw {
                    error: e,
                };
            }
        },
        image: async (_, args) => {
            let imageID = xss(args.imageID);
            if (!imageID || !imageID.trim()) throw "Invalid imageID";
            const images = await imagesCollection();
            const image = await images.findOne({ _id: imageID });
            if (image === null) {
                throw "Image not found";
            }
            return image;
        },
    },
    Mutation: {
        uploadImage: async (_, args) => {
            let food = xss(args.food);
            food = food === "true" ? true : false;
            let description = xss(args.description);
            let userName = xss(args.userName);
            let userID = xss(args.userID);
            let rid = xss(args.rid);

            if (!description || !description.trim())
                throw "Invalid description";
            if (description.length > 140) throw "Description is too long";
            if (!userName || !userName.trim()) throw "Invalid userName";
            if (!userID || !userID.trim()) throw "Invalid userID";
            if (!rid || !rid.trim()) throw "Invalid rid";

            const { createReadStream, filename } = await args.file;

            const key = uuid.v4();

            const stream = createReadStream();

            const out = require("fs").createWriteStream(
                "local-file-output.jpg"
            );

            stream.pipe(out);

            return await new Promise((resolve, reject) => {
                out.on("finish", () => {
                    resolve(
                        new Promise((resolve, reject) => {
                            im.crop(
                                {
                                    srcPath: "local-file-output.jpg",
                                    dstPath: "modified.jpg",
                                    width: 500,
                                },
                                function (err, stdout, stderr) {
                                    if (err) reject(err);
                                    resolve(
                                        new Promise((resolve, reject) => {
                                            s3.upload(
                                                {
                                                    ...s3DefaultParams,
                                                    Body: fs.readFileSync(
                                                        "modified.jpg"
                                                    ),
                                                    Key: `images/${key}${filename}`,
                                                },
                                                async (err, data) => {
                                                    if (err) {
                                                        console.log(
                                                            "error uploading...",
                                                            err
                                                        );
                                                        reject(err);
                                                    } else {
                                                        console.log(
                                                            "successfully uploaded file...",
                                                            data
                                                        );
                                                        fs.unlinkSync(
                                                            "modified.jpg"
                                                        );
                                                        fs.unlinkSync(
                                                            "local-file-output.jpg"
                                                        );

                                                        const images =
                                                            await imagesCollection();

                                                        const newImage = {
                                                            _id: uuid.v4(),
                                                            url: data.Location,
                                                            food: food,
                                                            description:
                                                                description,
                                                            userName: userName,
                                                            userID: userID,
                                                            rid: rid,
                                                            comments: [],
                                                        };
                                                        console.log(newImage);
                                                        await images.insertOne(
                                                            newImage
                                                        );
                                                        resolve(newImage);
                                                    }
                                                }
                                            );
                                        })
                                    );
                                }
                            );
                        })
                    );
                });
            });
        },
        addComment: async (_, args) => {
            let userName = xss(args.userName);
            let comment = xss(args.comment);
            let imageID = xss(args.imageID);
            if (!userName || !userName.trim()) throw "Invalid userName";
            if (!comment || !comment.trim()) throw "Invalid comment";
            if (comment.length > 140) throw "Comment is too long";
            if (!imageID || !imageID.trim()) throw "Invalid imageID";
            const images = await imagesCollection();
            const newComment = {
                userName: userName,
                comment: comment,
            };
            const updatedInfo = await images.updateOne(
                { _id: imageID },
                { $push: { comments: newComment } }
            );
            if (updatedInfo.modifiedCount === 0) {
                throw "could not add comment successfully";
            }
            return newComment;
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url} 🚀`);
});
