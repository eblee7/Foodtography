import React, { useState } from "react";
import ImageList from "./ImageList";
import { Link } from "react-router-dom";

const Restaurant = () => {
    //api call for location details based on useParams

    const [type, setType] = useState();
    const [id, setID] = useState();

    return (
        <>
            <p></p>
            <button onClick={() => setType("food")}> Food </button>
            <button onClick={() => setType("atmosphere")}> Atmosphere </button>
            {type && <ImageList type={type} id={id} />}
        </>
    );
};

export default Restaurant;
