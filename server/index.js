const { ApolloServer, gql } = require("apollo-server");
const mongoCollections = require("./config/mongoCollections");
const uuid = require("uuid"); //for generating _id's
const redis = require("redis");
const bluebird = require("bluebird");
const client = redis.createClient();
const axios = require("axios");
require("dotenv").config();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

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
        restaurants(rid: ID!): Restaurant
        images: [ImagePost]
        restaurantImages(rid: ID!): [ImagePost]
        userImages(userID: ID!): [ImagePost]
    }

    type ImagePost {
        _id: ID!
        url: String!
        description: String
        food: Boolean!
        rid: ID!
        userID: ID!
        comments: [Comment]
    }

    type Comment {
        userID: ID!
        comment: String!
    }

    type User {
        _id: ID!
        userName: String!
        password: String!
        email: String!
    }

    type Location {
        vicinity: String!
        latitude: Float!
        longitude: Float!
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
            rid: ID
            userID: ID
        ): ImagePost
        addUser(userName: String!, password: String!, email: String!): User
        addComment(userID: ID!, imageID: ID!, comment: String!): Comment
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
            return allUsers;
        },
        restaurants: async (_, args) => {
            let place_id = args.rid;
            let exist = await client.existsAsync(args.rid + "Details");
            if (exist) {
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
                    return {
                        name: data.results.name,
                        location: {
                            vicinity: data.results.formatted_address,
                            latitude: data.results.location.geometry.lat,
                            longitude: data.results.location.geometry.lng,
                        },
                    };
                } catch (e) {
                    throw {
                        error: e,
                    };
                }
            }
        },
        images: async () => {
            const images = await imagesCollection();
            const allimages = await images.find({}).toArray();
            return allimages;
        },
        restaurantImages: async (_, args) => {
            const images = await imagesCollection();
            const allimages = await images.find({ rid: args.rid }).toArray();
            return allimages;
        },
        userImages: async (_, args) => {
            const images = await imagesCollection();
            const allimages = await images
                .find({ userID: args.userID })
                .toArray();
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
                        let reference = nearbyData[i].photos[0].photo_reference;
                        // mongo to check to see if this id is in the res collection and has the url if it doesnt then u make the call and store
                        const restaurants = await restaurantsCollection();
                        const restaurantResult = await restaurants.findOne({
                            _id: nearbyData[i].place_id,
                        });
                        if (restaurantResult === null) {
                            config.url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${reference}&key=${apiKey}`;
                            let photoData = await axios(config);
                            places[i].url = photoData.request.res.responseUrl;
                            const newRestaurant = {
                                _id: places[i]._id,
                                url: places[i].url,
                            };
                            await restaurants.insertOne(newRestaurant);
                        } else {
                            console.log("from mongo");
                            places[i].url = restaurantResult.url;
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
            await users.insertOne(newUser);
            return newUser;
        },
        uploadImage: async (_, args) => {
            const images = await imagesCollection();
            let file = await args.file;
            console.log(file);
            const stream = file.createReadStream();
            const out = require("fs").createWriteStream(
                "local-file-output.txt"
            );
            stream.pipe(out);
            await finished(out);

            const newImage = {
                _id: uuid.v4(),
                url: "url",
                food: args.food,
                description: args.description,
                userID: args.userID,
                rid: args.rid,
                comments: [],
            };
            await images.insertOne(newImage);
            return newImage;
        },
        addComment: async (_, args) => {
            const images = await imagesCollection();
            const newComment = {
                userID: args.userID,
                comment: args.comment,
            };
            await images.updateOne(
                { _id: args.imageID },
                { $push: { comments: newComment } }
            );
            return newComment;
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url} 🚀`);
});
