import React, { useState } from "react";
import queries from "../queries";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import {
    Card,
    Container,
    Grid,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
} from "@mui/material";

const ImageList = ({ type, rid }) => {
    const [currentFood, setCurrentFood] = useState(null);
    const [getImages, { loading, error, data }] = useLazyQuery(
        queries.GET_RESTAURANT_IMAGES
    );
    let food = type === "food" ? true : false;
    if (food !== currentFood) {
        getImages({ variables: { rid, food }, fetchPolicy: "network-only" });
        setCurrentFood(food);
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

    //call getImages query
    if (data) {
        const { restaurantImages } = data;
        console.log(restaurantImages);
        return (
            <>
                <Container>
                    <Grid
                        container
                        spacing={{ xs: 2, md: 2 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                        {data.restaurantImages.length > 0 &&
                            data.restaurantImages.map((image, index) => {
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
                    {data.restaurantImages.length === 0 && (
                        <h2 className="container">No Images Posted</h2>
                    )}
                </Container>
            </>
        );
    }
};

export default ImageList;
