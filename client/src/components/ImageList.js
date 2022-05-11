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
    const [currentFood, setCurrentFood] = useState(null);
    const [getImages, { loading, error, data }] = useLazyQuery(
        queries.GET_RESTAURANT_IMAGES
    );
    let food = type === "food" ? true : false;
    if (food !== currentFood) {
        getImages({ variables: { rid, food } });
        setCurrentFood(food);
    }

    if (loading) return <p>Loading ...</p>;
    if (error) return `Error! ${error}`;

    //call getImages query
    if (data) {
        const { restaurantImages } = data;
        console.log(restaurantImages);
        return restaurantImages.map((image) => {
            return <img key={image.url} src={image.url} />;
        });
    }
};

export default ImageList;
