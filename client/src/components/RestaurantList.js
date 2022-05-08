import React from "react";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { useLocation, Link } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
// import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const RestaurantList = () => {
    const location = useLocation();

    let address = location.state ? location.state.address : "";

    const { loading, error, data } = useQuery(queries.GET_RESTAURANTS_NEARBY, {
        variables: { address },
    });

    // if (location.state === null) {
    //     return <div>Error</div>;
    // }

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        console.log(error);
        return <div>Error</div>;
    }
    if (data) {
        console.log(data);
        return (
            <Container>
                <ImageList
                    sx={{ overflow: "hidden" }}
                    cols={3}
                    gap={30}
                    variant="standard"
                >
                    {data.restaurantsNearby.nearest.map((res) => {
                        return (
                            <Link key={res._id} to={`/restaurant/${res._id}`}>
                                <ImageListItem>
                                    <img
                                        src={`${res.url}?w=248&fit=crop&auto=format`}
                                        srcSet={`${res.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        alt={res.name}
                                        loading="lazy"
                                    />
                                    <br />

                                    <p>{res.name}</p>
                                </ImageListItem>
                            </Link>
                        );
                    })}
                </ImageList>
            </Container>
        );
    } else {
        return <> </>;
    }
};

export default RestaurantList;