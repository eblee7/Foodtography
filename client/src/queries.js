import { gql } from "@apollo/client";

const GET_USERS = gql`
    query {
        users {
            _id
            userName
            password
            email
        }
    }
`;

const GET_RESTAURANTS_NEARBY = gql`
    query GetRestaurantsNearby($address: String!) {
        restaurantsNearby(address: $address) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const GET_RESTAURANTS = gql`
    query {
        restaurants {
            _id
            name
            location
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
            userID
            comments {
                userID
                comment
            }
        }
    }
`;

const GET_RESTAURANT_IMAGES = gql`
    query GetRestaurantImages($rid: ID!) {
        restaurantImages(rid: $rid) {
            _id
            name
            location
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
            userID
            comments {
                userID
                comment
            }
        }
    }
`;

const UPLOAD_IMAGE = gql`
    mutation UploadImage(
        $url: String!
        $food: Boolean!
        $description: String
        $rid: ID
        $userID: ID
    ) {
        uploadImage(
            url: $url
            food: $food
            description: $description
            rid: $rid
            userId: $userId
        ) {
            _id
            url
            description
            food
            rid
            userID
            comments {
                userID
                comment
            }
        }
    }
`;

const ADD_USER = gql`
    mutation AddUser($userName: String!, $password: String!, $email: String!) {
        addUser(userName: $userName, password: $password, email: $email) {
            _id
            userName
            email
        }
    }
`;

const ADD_COMMENT = gql`
    mutation AddComment($userID: ID!, $imageID: ID!, $comment: String!) {
        addComment(userID: $userID, imageID: $imageID, comment: $comment) {
            userID
            comment
        }
    }
`;
let exported = {
    GET_USERS,
    GET_RESTAURANTS_NEARBY,
    GET_RESTAURANTS,
    GET_IMAGES,
    GET_RESTAURANT_IMAGES,
    GET_USER_IMAGES,
    UPLOAD_IMAGE,
    ADD_USER,
    ADD_COMMENT,
};

export default exported;
