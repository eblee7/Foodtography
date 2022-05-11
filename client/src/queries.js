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
        images(imageID: $imageID) {
            _id
            url
            description
            food
            rid
            userName
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
    ) {
        uploadImage(
            file: $file
            food: $food
            description: $description
            rid: $rid
            userName: $userName
        ) {
            _id
            url
            description
            food
            rid
            userName
            comments {
                userName
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
    GET_RESTAURANT,
    GET_IMAGE,
    GET_RESTAURANT_IMAGES,
    GET_USER_IMAGES,
    UPLOAD_IMAGE,
    ADD_USER,
    ADD_COMMENT,
};

export default exported;
