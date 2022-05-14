import React from "react";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { useParams, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";

import ".././App.css";

const RestaurantList = () => {
  const { address } = useParams();

  const { loading, error, data } = useQuery(queries.GET_RESTAURANTS_NEARBY, {
    variables: { address },
  });

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
      <>
        <Container>
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {data.restaurantsNearby.nearest.map((res, index) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={index}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardHeader
                      title={
                        <Link
                          style={{
                            color: "inherit",
                            textDecoration: "inherit",
                          }}
                          className="link-restyling"
                          to={`/restaurant/${res._id}`}
                        >
                          {res.name}{" "}
                        </Link>
                      }
                      subheader={res.location.vicinity}
                    />
                    <CardMedia
                      component="img"
                      height="194"
                      image={res.url}
                      alt={res.name}
                    />
                    {/* <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Restaurant description?
                      </Typography>
                    </CardContent> */}
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </>
    );
  } else {
    return <> </>;
  }
};

export default RestaurantList;
