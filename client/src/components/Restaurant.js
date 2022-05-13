import React, { useState } from "react";
import ImageList from "./ImageList";
import UploadModal from "./modal/UploadModal";
import { useAuth } from "../contexts/AuthContext";

const Restaurant = () => {
    //api call for location details based on useParams

    const [type, setType] = useState();
    const [uploadModal, setuploadModal] = useState(false);
    const [rid, setID] = useState(); //restaurant id
    const { currentUser } = useAuth();

    const handleCloseModals = () => {
        setuploadModal(false);
    };

    const handleOpenUploadModal = () => {
        setuploadModal(true);
    };

    return (
        <>
            {type && currentUser && (
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
