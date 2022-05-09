import React, { useState } from "react";
import ImageList from "./ImageList";
import UploadModal from "./modal/UploadModal";

const Restaurant = () => {
    //api call for location details based on useParams

    const [type, setType] = useState();
    const [uploadModal, setuploadModal] = useState(false);
    const [rid, setID] = useState(); //restaurant id

    const handleCloseModals = () => {
        setuploadModal(false);
    };

    const handleOpenUploadModal = () => {
        setuploadModal(true);
    };

    return (
        <>
            {type && (
                <button className="button" onClick={handleOpenUploadModal}>
                    {" "}
                    Upload Image
                </button>
            )}
            <button onClick={() => setType("food")}> Food </button>
            <button onClick={() => setType("atmosphere")}> Atmosphere </button>
            {type && <ImageList type={type} rid={rid} />}
            {uploadModal && uploadModal && (
                <UploadModal
                    isOpen={uploadModal}
                    handleClose={handleCloseModals}
                    type={type}
                />
            )}
        </>
    );
};

export default Restaurant;
