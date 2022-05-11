import React, { useState } from "react";
import queries from "../queries";
import { useLazyQuery } from "@apollo/client";

const ImageList = ({ type, rid }) => {
    //upload functionality
    //form (id,type,user,picture)
    //which would already have the id populated
    // type which is already populated
    // user (login thing)
    // upload picture
    //uploadImage mutation
    const [called, setCalled] = useState(false);
    const [getImages, { loading, error, data }] = useLazyQuery(
        queries.GET_RESTAURANT_IMAGES
    );
    let food = type === "food" ? true : false;

    if (loading) return <p>Loading ...</p>;
    if (error) return `Error! ${error}`;
    if (called === false) {
        getImages({ variables: { rid, food } });
        setCalled(true);
    }

    //call getImages query
    if (data) {
        const { restaurantImages } = data;
        return restaurantImages.map((image) => {
            return <img src={image.url} />;
        });
    }
};

export default ImageList;
