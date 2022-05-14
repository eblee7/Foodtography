import React, { useState } from "react";
import queries from "../queries";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

const ImageList = ({ type, rid }) => {
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
            console.log(image);
            return (
                <Link key={image._id} to={`/image/${image._id}`}>
                    <img alt="temporary" src={image.url} />
                </Link>
            );
        });
    }
};

export default ImageList;
