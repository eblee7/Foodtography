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
require("dotenv").config();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

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
// const handleFileUpload = async (file) => {
//     console.log(file, "file");
//     const { createReadStream, filename } = await file;

//     const key = uuid.v4();

//     const stream = createReadStream();

//     const out = require("fs").createWriteStream("images/local-file-output.jpg");

//     stream.pipe(out);

//     out.on("finish", () => {
//         im.resize(
//             {
//                 srcPath: "images/local-file-output.jpg",
//                 dstPath: "images/modified.jpg",
//                 width: 256,
//                 height: 256,
//             },
//             function (err, stdout, stderr) {
//                 if (err) throw err;
//                 return new Promise((resolve, reject) => {
//                     s3.upload(
//                         {
//                             ...s3DefaultParams,
//                             Body: fs.readFileSync("images/modified.jpg"),
//                             Key: `images/${key}${filename}`,
//                         },
//                         (err, data) => {
//                             if (err) {
//                                 console.log("error uploading...", err);
//                                 reject(err);
//                             } else {
//                                 console.log(
//                                     "successfully uploaded file...",
//                                     data
//                                 );
//                                 resolve(data);
//                             }
//                         }
//                     );
//                 });
//             }
//         );
//     });

//     const s3Params = {
//         Bucket: process.env.S3_BUCKET_NAME,
//         Key: key + filename,
//         Expire: 60,
//         ACL: "public-read",
//     };

//     const url = s3.getSignedUrl("getObject", s3Params);
//     // const url = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/images/${key}${filename}`;

//     return url;
// };

//Some Mock Data
const restaurantsCollection = mongoCollections.restaurants;
const imagesCollection = mongoCollections.images;
const usersCollection = mongoCollections.users;

/* <input> location </input> -> shoot to mutation query -> places api (url+ location) return {lat: x lng: x} -> nearby api (url + lat + lng + type (restaurant )) return { restaurants}
-> sent to the front end and displayed  */

const apiKey = process.env.GOOGLE_API_KEY;

//Create the type definitions for the query and our data
const typeDefs = gql`
    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }

    type Query {
        users: [User]
        restaurantsNearby(address: String!): Nearby
        restaurant(rid: ID!): Restaurant
        restaurantImages(rid: ID!, food: Boolean!): [ImagePost]
        userImages(userID: ID!): [ImagePost]
        image(imageID: ID!): ImagePost
    }

    type ImagePost {
        _id: ID!
        url: String!
        description: String
        food: Boolean!
        rid: ID!
        userName: String!
        comments: [Comment]
    }

    type Comment {
        userName: String!
        comment: String!
    }

    type User {
        _id: ID!
        userName: String!
        password: String!
        email: String!
        posts: [ImagePost]
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
        ): ImagePost
        addUser(userName: String!, password: String!, email: String!): User
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
        users: async () => {
            const users = await usersCollection();
            const allUsers = await users.find({}).toArray();
            if (!allUsers) throw "Could not get all users";
            return allUsers;
        },
        restaurant: async (_, args) => {
            let place_id = args.rid;
            let exist = await client.existsAsync(args.rid + "Details");
            if (exist) {
                console.log("from redis");
                let placeDetailsJSON = await client.getAsync(
                    args.rid + "Details"
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
                        args.rid + "Details",
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
            const images = await imagesCollection();
            const allimages = await images
                .find({ rid: args.rid, food: args.food })
                .toArray();
            if (!allimages) throw "Could not get restaurant images";
            return allimages;
        },
        userImages: async (_, args) => {
            const images = await imagesCollection();
            const allimages = await images
                .find({ userID: args.userID })
                .toArray();
            if (!allimages) throw "Could not get user images";

            return allimages;
        },
        restaurantsNearby: async (_, args) => {
            if (!args.address) {
                throw "No Address Provided";
            }
            var config = {
                method: "get",
                url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${args.address}&inputtype=textquery&fields=formatted_address%2Cplace_id%2Cname%2Cgeometry&key=${apiKey}`,
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

                // let data = {
                //     place_id: "ChIJTWpC695ZwokRloO5qV4pt1I",
                // };
                // let addressVicinity =
                //     "1 Castle Point Terrace, Hoboken, NJ 07030, United States";

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

                // copy data here when not using api

                // let searchResults = {
                //     address: addressVicinity,
                //     nearest: data,
                // };
                // return searchResults;
            } catch (e) {
                console.log(e);
                throw {
                    error: e,
                };
            }
        },
        image: async (_, args) => {
            // let exists = await client.existsAsync(args.imageID + "image");
            // if (exists) {
            //     let imageJSON = await client.getAsync(args.imageID + "image");
            //     let image = JSON.parse(imageJSON);
            //     return image;
            // } else {
            const images = await imagesCollection();
            const image = await images.findOne({ _id: args.imageID });
            if (image === null) {
                throw "Image not found";
            }
            // await client.setAsync(
            //     args.imageID + "image",
            //     JSON.stringify(image)
            // );
            return image;
            // }
        },
    },
    Mutation: {
        addUser: async (_, args) => {
            const users = await usersCollection();
            const newUser = {
                _id: uuid.v4(),
                userName: args.userName,
                password: args.password,
                email: args.email,
                posts: [],
            };
            const insertInfo = await users.insertOne(newUser);
            if (!insertInfo.acknowledged || !insertInfo.insertedId)
                throw "Could not add user";
            return newUser;
        },
        uploadImage: async (_, args) => {
            const { createReadStream, filename } = await args.file;

            const key = uuid.v4();

            const stream = createReadStream();

            const out = require("fs").createWriteStream(
                "images/local-file-output.jpg"
            );

            stream.pipe(out);

            return await new Promise((resolve, reject) => {
                out.on("finish", () => {
                    resolve(
                        new Promise((resolve, reject) => {
                            im.resize(
                                {
                                    srcPath: "images/local-file-output.jpg",
                                    dstPath: "images/modified.jpg",
                                    width: 256,
                                    height: 256,
                                },
                                function (err, stdout, stderr) {
                                    if (err) reject(err);
                                    resolve(
                                        new Promise((resolve, reject) => {
                                            s3.upload(
                                                {
                                                    ...s3DefaultParams,
                                                    Body: fs.readFileSync(
                                                        "images/modified.jpg"
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
                                                        const images =
                                                            await imagesCollection();

                                                        const newImage = {
                                                            _id: uuid.v4(),
                                                            url: data.Location,
                                                            food: args.food,
                                                            description:
                                                                args.description,
                                                            userName:
                                                                args.userName,
                                                            rid: args.rid,
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
            const images = await imagesCollection();
            const newComment = {
                userName: args.userName,
                comment: args.comment,
            };
            const updatedInfo = await images.updateOne(
                { _id: args.imageID },
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
