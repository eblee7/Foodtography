const dbConnection = require("../config/mongoConnection");
const mongoCollections = require("../config/mongoCollections");
const uuid = require("uuid");

const images = mongoCollections.images;

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    const imagesCollection = await images();

    await imagesCollection.insertMany([
        //filler employer data
        {
            _id: uuid.v4(),
            url: "https://foodtography-images.s3.amazonaws.com/images/stock-photo-restaurant-summer-turkey-cafe-atmosphere-terrace-bougainvillea-cozy-alacati-d064cc1c-7b39-46d3-b8b3-61dd81dc178e.jpeg",
            description: "This place was so amazing",
            food: false,
            userID: "nYfae2OWWjVF9Hq7kjf3kZnLMCc2",
            userName: "Bob",
            rid: "ChIJ4X5J699ZwokRNp75PybAfCY",
            comments: [],
        },
        {
            _id: uuid.v4(),
            url: "https://foodtography-images.s3.amazonaws.com/images/deep-dish-pizza-chicago.jpeg",
            description:
                "This is the best pizza I have ever tried! Definitely go try it yourself 5/5.",
            food: true,
            userID: "nYfae2OWWjVF9Hq7kjf3kZnLMCc2",
            userName: "Bob",
            rid: "ChIJ4X5J699ZwokRNp75PybAfCY",
            comments: [],
        },
        {
            _id: uuid.v4(),
            url: "https://foodtography-images.s3.amazonaws.com/images/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpeg",
            description:
                "Never tasted anything tastier!! Would definitely go back for more.",
            food: true,
            userID: "nYfae2OWWjVF9Hq7kjf3kZnLMCc2",
            userName: "Bob",
            rid: "ChIJ4X5J699ZwokRNp75PybAfCY",
            comments: [],
        },
        {
            _id: uuid.v4(),
            url: "https://foodtography-images.s3.amazonaws.com/images/best-paris-cafe-ambience-videos.jpeg",
            description:
                "Great service, and overall a great experience. Would definitely come here again.",
            food: false,
            userID: "nYfae2OWWjVF9Hq7kjf3kZnLMCc2",
            userName: "Bob",
            rid: "ChIJ4X5J699ZwokRNp75PybAfCY",
            comments: [],
        },
        {
            _id: uuid.v4(),
            url: "https://foodtography-images.s3.amazonaws.com/images/coffee.png",
            description:
                "If you ever had a tiring morning this is definitely the kicker to wake you up!",
            food: true,
            userID: "nYfae2OWWjVF9Hq7kjf3kZnLMCc2",
            userName: "Bob",
            rid: "ChIJ4X5J699ZwokRNp75PybAfCY",
            comments: [],
        },
        {
            _id: uuid.v4(),
            url: "https://foodtography-images.s3.amazonaws.com/images/restaurant-furniture-turkey.jpeg",
            description: "This is one of my favorite spots",
            food: false,
            userID: "nYfae2OWWjVF9Hq7kjf3kZnLMCc2",
            userName: "Bob",
            rid: "ChIJ4X5J699ZwokRNp75PybAfCY",
            comments: [],
        },
        {
            _id: uuid.v4(),
            url: "https://foodtography-images.s3.amazonaws.com/images/eggs1.jpg",
            description: "These were really good!",
            food: true,
            userID: "nYfae2OWWjVF9Hq7kjf3kZnLMCc2",
            userName: "Bob",
            rid: "ChIJ4X5J699ZwokRNp75PybAfCY",
            comments: [],
        },
        {
            _id: uuid.v4(),
            url: "https://foodtography-images.s3.amazonaws.com/images/japanese-food.jpeg",
            description: "Amazing",
            food: true,
            userID: "nYfae2OWWjVF9Hq7kjf3kZnLMCc2",
            userName: "Bob",
            rid: "ChIJ4X5J699ZwokRNp75PybAfCY",
            comments: [],
        },
        {
            _id: uuid.v4(),
            url: "https://foodtography-images.s3.amazonaws.com/images/steak.jpg",
            description: "The steak was really juicy and delicious",
            food: true,
            userID: "nYfae2OWWjVF9Hq7kjf3kZnLMCc2",
            userName: "Bob",
            rid: "ChIJ4X5J699ZwokRNp75PybAfCY",
            comments: [],
        },
        {
            _id: uuid.v4(),
            url: "https://foodtography-images.s3.amazonaws.com/images/dumplings.jpg",
            description: "Best dumplings around this area",
            food: true,
            userID: "nYfae2OWWjVF9Hq7kjf3kZnLMCc2",
            userName: "Bob",
            rid: "ChIJ4X5J699ZwokRNp75PybAfCY",
            comments: [],
        },
    ]);

    console.log("Done seeding database");
    await db.serverConfig.close();
};

main().catch(console.log);
