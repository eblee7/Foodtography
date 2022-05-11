import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import queries from "../queries";
import ImageList from "./ImageList";
import UploadModal from "./modal/UploadModal";

const Restaurant = () => {
    const { id } = useParams();
    //api call for location details based on useParams

    const [type, setType] = useState();
    const [uploadModal, setuploadModal] = useState(false);

    const { loading, error, data } = useQuery(queries.GET_RESTAURANT, {
        variables: { rid: id },
    });

    const handleCloseModals = () => {
        setuploadModal(false);
    };

    const handleOpenUploadModal = () => {
        setuploadModal(true);
    };

    if (loading) return "Loading...";

    if (error) return `Error! ${error.message}`;

    if (data) {
        const { restaurant } = data;
        console.log(restaurant);
        return (
            <>
                <h1>{restaurant.name}</h1>
                <h1>{restaurant.location.vicinity}</h1>
                {type && (
                    <button className="button" onClick={handleOpenUploadModal}>
                        {" "}
                        Upload Image
                    </button>
                )}
                <button onClick={() => setType("food")}> Food </button>
                <button onClick={() => setType("atmosphere")}>
                    {" "}
                    Atmosphere{" "}
                </button>
                {type && <ImageList type={type} rid={id} />}
                {uploadModal && uploadModal && (
                    <UploadModal
                        isOpen={uploadModal}
                        handleClose={handleCloseModals}
                        rid={id}
                        type={type}
                    />
                )}
            </>
        );
    }
};

export default Restaurant;
