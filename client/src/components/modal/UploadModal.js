import React, { useState } from "react";
import ReactModal from "react-modal";
import { useMutation } from "@apollo/client";
import { useAuth } from "../../firebase/AuthContext";
//Import the file where my query constants are defined
import queries from "../../queries";

//For react-modal
ReactModal.setAppElement("#root");
const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        border: "1px solid #28547a",
        borderRadius: "4px",
    },
};

function UploadModal(props) {
    const { currentUser } = useAuth();
    const [showhandleCloseUploadModal, setShowhandleCloseUploadModal] =
        useState(props.isOpen);

    let food = props.type === "food" ? true : false;

    const [uploadImage] = useMutation(queries.UPLOAD_IMAGE, {
        update(cache, { data: { uploadImage } }) {
            const { restaurantImages } = cache.readQuery({
                query: queries.GET_RESTAURANT_IMAGES,
                variables: { rid: props.rid, food },
            });
            console.log(uploadImage);
            cache.writeQuery({
                query: queries.GET_RESTAURANT_IMAGES,
                data: {
                    restaurantImages: restaurantImages.concat([uploadImage]),
                },
                variables: { rid: props.rid, food },
            });
        },
    });

    //   const [addEmployer] = useMutation(queries.UPLOAD_IMAGE, {
    //     update(cache, {data: {addEmployer}}) {
    //       const {employers} = cache.readQuery({
    //         query: queries.GET_EMPLOYERS_WITH_EMPLOYEES
    //       });
    //       cache.writeQuery({
    //         query: queries.GET_EMPLOYERS_WITH_EMPLOYEES,
    //         data: {employers: employers.concat([addEmployer])}
    //       });
    //     }
    //   });

    //   const {data} = useQuery(queries.GET_EMPLOYERS);

    const handleClosehandleCloseUploadModal = () => {
        setShowhandleCloseUploadModal(true);
        props.handleClose(false);
    };

    let body = null;
    let imageDescription;
    let file;
    body = (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                console.log(file.files, "file");
                uploadImage({
                    variables: {
                        file: file.files[0],
                        food: food,
                        description: imageDescription.value,
                        rid: props.rid,
                        userName: currentUser.email,
                    },
                });
                imageDescription.value = "";
                setShowhandleCloseUploadModal(false);
                alert("Image Added");
                props.handleClose();
            }}
        >
            <div>
                <label>
                    Upload Image
                    <br />
                    <input
                        type="file"
                        accept="image/jpeg, image/png, .jpeg, .jpg, .png"
                        ref={(node) => {
                            file = node;
                        }}
                        required
                        autoFocus={true}
                    />
                </label>
            </div>
            <br />
            <div>
                <label>
                    Image Description
                    <br />
                    <input
                        ref={(node) => {
                            imageDescription = node;
                        }}
                        required
                    />
                </label>
            </div>
            <br />

            <button type="submit">Upload Picture</button>
        </form>
    );

    return (
        <div>
            <ReactModal
                name="handleCloseUploadModal"
                isOpen={showhandleCloseUploadModal}
                contentLabel="Upload Modal"
                style={customStyles}
            >
                {body}
                <button
                    className="button cancel-button"
                    onClick={handleClosehandleCloseUploadModal}
                >
                    Cancel
                </button>
            </ReactModal>
        </div>
    );
}

export default UploadModal;
