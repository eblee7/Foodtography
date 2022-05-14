import React from "react";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { useParams, Link } from "react-router-dom";
import noImage from "../img/noimage.jpeg";
import {
    Card,
    CardHeader,
    Container,
    Grid,
    CardMedia,
    CircularProgress,
    Alert,
    AlertTitle,
} from "@mui/material";

import ".././App.css";

const RestaurantList = () => {
    const { address } = useParams();

    const { loading, error, data } = useQuery(queries.GET_RESTAURANTS_NEARBY, {
        variables: { address },
    });

    if (loading) {
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
    }
    if (error) {
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
                    <strong>404 Error Not Found</strong>
                </Alert>
            </Grid>
        </Grid>;
    }
    if (data) {
        console.log(data);
        return (
            <>
                <Container>
                    <p>Results For: {data.restaurantsNearby.address}</p>
                    <Grid
                        container
                        spacing={{ xs: 2, md: 2 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                        {data.restaurantsNearby.nearest.length > 0 ? (
                            data.restaurantsNearby.nearest.map((res, index) => {
                                return (
                                    <Grid item xs={2} sm={4} md={4} key={index}>
                                        <Card sx={{ maxWidth: 345 }}>
                                            <CardHeader
                                                title={
                                                    <Link
                                                        style={{
                                                            color: "inherit",
                                                            textDecoration:
                                                                "inherit",
                                                        }}
                                                        className="link-restyling"
                                                        to={`/restaurant/${res._id}`}
                                                    >
                                                        {res.name}{" "}
                                                    </Link>
                                                }
                                                subheader={
                                                    res.location.vicinity
                                                }
                                            />
                                            <CardMedia
                                                component="img"
                                                height="194"
                                                image={
                                                    (res.url && res.url) ||
                                                    noImage
                                                }
                                                alt={res.name}
                                            />
                                        </Card>
                                    </Grid>
                                );
                            })
                        ) : (
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
                                        <strong>404 Error Not Found</strong>
                                    </Alert>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Container>
                <br />
            </>
        );
    } else {
        return (
            <>
                {" "}
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
                            <strong>404 Error Not Found</strong>
                        </Alert>
                    </Grid>
                </Grid>
                ;
            </>
        );
    }
};

export default RestaurantList;
