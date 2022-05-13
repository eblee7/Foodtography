import React from "react";

const ImageList = ({ type, id }) => {
    //upload functionality
    //form (id,type,user,picture)
    //which would already have the id populated
    // type which is already populated
    // user (login thing)
    // upload picture
    //uploadImage mutation

    //call getImages query
    if (type === "food") {
        return <div>Food</div>;
    }
    if (type === "atmosphere") {
        return <div>Atmosphere</div>;
    }
    return (
        <>
            <p> Image List</p>
        </>
    );
};

export default ImageList;
