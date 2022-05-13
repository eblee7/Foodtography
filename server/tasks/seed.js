const dbConnection = require("../config/mongoConnection");
const mongoCollections = require("../config/mongoCollections");
const uuid = require("uuid");

const users = mongoCollections.users;
const images = mongoCollections.images;
const restaurants = mongoCollections.restaurants;

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    const usersCollection = await users();
    const imagesCollection = await images();
    const restaurantsCollection = await restaurants();

    await usersCollection.insertMany([
        //filler employee data
        {
            _id: "1",
            userName: "brian",
            password: "hashed", //hashed
            email: "brian@gmail.com",
            posts: [],
            location: { latitude: 20, longitude: 50 },
        },
        {
            _id: "2",
            userName: "viola",
            password: "hashed", //hashed
            email: "viola@gmail.com",
            posts: [],
            location: { latitude: 20, longitude: 50 },
        },
        {
            _id: "3",
            userName: "naomi",
            password: "hashed", //hashed
            email: "naomi@gmail.com",
            posts: [],
            location: { latitude: 20, longitude: 50 },
        },
    ]);

    await restaurantsCollection.insertMany([
        //filler employer data
        {
            _id: "4",
            name: "McDonalds",
            location: { latitude: 20, longitude: 50 },
        },
    ]);

    await imagesCollection.insertMany([
        //filler employer data
        {
            _id: "5",
            description: "fastfood",
            url: "bear",
            userID: "1",
            rid: "4",
            comments: [],
            food: true,
            location: { latitude: 20, longitude: 50 },
        },
    ]);

    console.log("Done seeding database");
    await db.serverConfig.close();
};

main().catch(console.log);
