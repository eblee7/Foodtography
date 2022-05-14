import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";
import queries from "../queries";
import ImageList from "./ImageList";
import UploadModal from "./modal/UploadModal";
import {
    Box,
    Typography,
    Container,
    Stack,
    Button,
    CircularProgress,
    Grid,
    Alert,
    AlertTitle,
} from "@mui/material";

const Restaurant = () => {
    const { id } = useParams();
    //api call for location details based on useParams
    const { currentUser } = useAuth();

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

    if (loading)
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: "50vh" }}
            >
                <Grid item xs={3}>
                    <CircularProgress />
                </Grid>
            </Grid>
        );

    if (error)
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: "50vh" }}
            >
                <Grid item xs={3}>
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        <strong>${error.message}</strong>
                    </Alert>
                </Grid>
            </Grid>
        );

    if (data) {
        const { restaurant } = data;
        console.log(restaurant);
        return (
            <>
                <Box
                    sx={{
                        bgcolor: "background.paper",
                        pt: 8,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            {restaurant.name}
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            color="text.secondary"
                            paragraph
                        >
                            {restaurant.location.vicinity}
                        </Typography>
                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            <Button
                                variant="outlined"
                                onClick={() => setType("food")}
                            >
                                Food
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setType("atmosphere")}
                            >
                                Atmosphere
                            </Button>
                        </Stack>

                        {currentUser && type && (
                            <Stack
                                sx={{ pt: 4 }}
                                direction="row"
                                spacing={2}
                                justifyContent="center"
                            >
                                <Button
                                    variant="contained"
                                    onClick={handleOpenUploadModal}
                                >
                                    Upload Image
                                </Button>
                            </Stack>
                        )}
                    </Container>
                </Box>
                <br />
                {type && <ImageList type={type} rid={id} />}
                <br />
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

// return (
//     <>
//       <h1>{restaurant.name}</h1>
//       <h1>{restaurant.location.vicinity}</h1>
//       {currentUser && type && (
//         <button className="button" onClick={handleOpenUploadModal}>
//           {" "}
//           Upload Image
//         </button>
//       )}
//       <button onClick={() => setType("food")}> Food </button>
//       <button onClick={() => setType("atmosphere")}> Atmosphere </button>
//       {type && <ImageList type={type} rid={id} />}
//       {uploadModal && uploadModal && (
//         <UploadModal
//           isOpen={uploadModal}
//           handleClose={handleCloseModals}
//           rid={id}
//           type={type}
//         />
//       )}
//     </>
//   );

export default Restaurant;
