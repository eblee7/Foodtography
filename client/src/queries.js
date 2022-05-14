import { gql } from "@apollo/client";

const GET_RESTAURANTS_NEARBY = gql`
  query GetRestaurantsNearby($address: String!) {
    restaurantsNearby(address: $address) {
      address
      nearest {
        _id
        name
        url
        location {
          vicinity
          latitude
          longitude
        }
      }
    }
  }
`;

const GET_RESTAURANT = gql`
  query GetRestaurant($rid: ID!) {
    restaurant(rid: $rid) {
      _id
      name
      location {
        vicinity
        latitude
        longitude
      }
    }
  }
`;

const GET_IMAGE = gql`
  query GetImage($imageID: ID!) {
    image(imageID: $imageID) {
      _id
      url
      description
      food
      rid
      userName
      userID
      comments {
        userName
        comment
      }
    }
  }
`;

const GET_RESTAURANT_IMAGES = gql`
  query GetRestaurantImages($rid: ID!, $food: Boolean!) {
    restaurantImages(rid: $rid, food: $food) {
      _id
      url
      description
      food
      rid
      userName
      userID
      comments {
        userName
        comment
      }
    }
  }
`;

const GET_IMAGES = gql`
  query {
    images {
      _id
      url
      description
      food
      rid
      userName
      userID
      comments {
        userName
        comment
      }
    }
  }
`;

const GET_USER_IMAGES = gql`
  query GetUserImages($userID: ID!) {
    userImages(userID: $userID) {
      _id
      url
      description
      food
      rid
      userName
      userID
      comments {
        userName
        comment
      }
    }
  }
`;

const UPLOAD_IMAGE = gql`
  mutation UploadImage(
    $file: Upload!
    $food: Boolean!
    $description: String
    $rid: ID!
    $userName: String!
    $userID: ID!
  ) {
    uploadImage(
      file: $file
      food: $food
      description: $description
      rid: $rid
      userName: $userName
      userID: $userID
    ) {
      _id
      url
      description
      food
      rid
      userName
      userID
      comments {
        userName
        comment
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($userName: String!, $imageID: ID!, $comment: String!) {
    addComment(userName: $userName, imageID: $imageID, comment: $comment) {
      comment
    }
  }
`;
let exported = {
  GET_RESTAURANTS_NEARBY,
  GET_RESTAURANT,
  GET_IMAGE,
  GET_RESTAURANT_IMAGES,
  GET_USER_IMAGES,
  UPLOAD_IMAGE,
  ADD_COMMENT,
  GET_IMAGES,
};

export default exported;
