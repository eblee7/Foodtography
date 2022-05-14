import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { useAuth } from "../firebase/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import queries from "../queries";
import { useQuery } from "@apollo/client";
import {
    Card,
    Container,
    Grid,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Button,
    CircularProgress,
} from "@mui/material";

export default function Account() {
    const [error2, setError] = useState("");
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const { loading, error, data } = useQuery(queries.GET_USER_IMAGES, {
        variables: { userID: currentUser.uid },
        fetchPolicy: "network-only",
    });

    async function handleLogout() {
        setError("");
        try {
            await logout();
            navigate("/signin");
        } catch {
            setError("Failed to log out");
        }
    }
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
    if (error) return `Error! ${error}`;
    if (data) {
        const { userImages } = data;
        console.log(userImages);
        return (
            <>
                {/* <BootCard>
          <BootCard.Body>
            <h2 className="text-center mb-4">Profile</h2>
            {error2 && <Alert variant="danger">{error2}</Alert>}
            <strong>Name:</strong> {currentUser.displayName}
            <strong>Email:</strong> {currentUser.email}
             <UpdateProfile /> 
          </BootCard.Body>
        </BootCard>
        <div className="w-100 text-center mt-2">
          <Button variant="link" onClick={handleLogout}>
            Log Out
          </Button>
        </div> */}

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
                            {currentUser.displayName}
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            color="text.secondary"
                            paragraph
                        >
                            Email: {currentUser.email}
                        </Typography>
                        {error2 && <Alert variant="danger">{error2}</Alert>}
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleLogout}
                        >
                            Log Out
                        </Button>
                    </Container>
                </Box>
                <br />
                <Container>
                    <Grid
                        container
                        spacing={{ xs: 2, md: 2 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                        {userImages.length > 0 &&
                            userImages.map((image, index) => {
                                return (
                                    <Grid item xs={2} sm={4} md={4} key={index}>
                                        <Card sx={{ maxWidth: 345 }}>
                                            <Link
                                                key={image._id}
                                                to={`/image/${image._id}`}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height="194"
                                                    image={image.url}
                                                    alt={image.userName}
                                                />
                                            </Link>
                                            <CardContent>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {image.description}
                                                    <br />
                                                    by: {image.userName}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                    </Grid>
                    {userImages.length === 0 && (
                        <h2 className="container">No Images Posted</h2>
                    )}
                </Container>
            </>
        );
    }
}
