const { ApolloServer, gql } = require('apollo-server');
const mongoCollections = require('./config/mongoCollections');
const uuid = require('uuid'); //for generating _id's
const redis = require("redis");
const bluebird = require("bluebird");
const client = redis.createClient();
const axios = require("axios");

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

//Some Mock Data
const restaurantsCollection = mongoCollections.restaurants;
const imagesCollection = mongoCollections.images;
const usersCollection = mongoCollections.users;


//Create the type definitions for the query and our data
const typeDefs = gql`
    type Query {
        users: [User]
        restaurants: [Restaurant]
        images: [ImagePost]
        restaurantImages(rid: ID): [ImagePost]
        userImages(userID: ID): [ImagePost]
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
        location: Location
    }

    type Location {
      latitude: Float!
      longitude: Float!
    }

    type Restaurant {
        _id: ID!
        name: String!
        description: String!
        location: Location!
    }

    type Mutation {
        uploadImage(
            url: String!
            food: Boolean!
            description: String
            rid: ID
            userID: ID
        ): ImagePost
        addUser(
          userName: String!
          password: String!
          email: String!
        ): User
        addComment(
          userID: ID!
          imageID: ID!
          comment: String!
        ): Comment
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
    restaurants: async () => {
      const restaurants = await restaurantsCollection();
      const allrestaurants = await restaurants.find({}).toArray();
      return allrestaurants;
    },
    images: async () => {
      const images = await imagesCollection();
      const allimages = await images.find({}).toArray();
      return allimages;
    },
    restaurantImages: async (_, args) => {
      const images = await imagesCollection();
      const allimages = await images.find({ rid: args.rid}).toArray();
      return allimages
    },
    userImages: async (_, args) => {
      const images = await imagesCollection();
      const allimages = await images.find({userID: args.userID}).toArray();
      return allimages
    }
  },
  Mutation: {
    addUser: async (_, args) => {
      const users = await usersCollection();
      const newUser = {
        _id: uuid.v4(),
        userName: args.userName,
        password: args.password,
        email: args.email,
        posts: []
      };
      await users.insertOne(newUser);
      return newUser;
    },
    uploadImage: async (_, args) => {
      const images = await imagesCollection();
      const newImage = {
        _id: uuid.v4(),
        url: args.url,
        food: args.food,
        description: args.description,
        userID: args.userID,
        rid: args.rid,
        comments: []
      };
      await images.insertOne(newImage);
      return newImage;
    },
    addComment: async (_, args) => {
      const images = await imagesCollection();
      const newComment = {
        userID:  args.userID,
        comment: args.comment
      };
      await images.updateOne({ _id: args.imageID}, { $push: {comments : newComment } })
      return  newComment;
    }
  }
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});