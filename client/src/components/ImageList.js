import React, { useState } from "react";
import queries from "../queries";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const ImageList = ({ type, rid }) => {
  //upload functionality
  //form (id,type,user,picture)
  //which would already have the id populated
  // type which is already populated
  // user (login thing)
  // upload picture
  //uploadImage mutation
  const [currentFood, setCurrentFood] = useState(null);
  const [getImages, { loading, error, data }] = useLazyQuery(
    queries.GET_RESTAURANT_IMAGES
  );
  let food = type === "food" ? true : false;
  if (food !== currentFood) {
    getImages({ variables: { rid, food } });
    setCurrentFood(food);
  }

  if (loading) return <p>Loading ...</p>;
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
            {data.restaurantImages.map((image, index) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={index}>
                  <Card sx={{ maxWidth: 345 }}>
                    <Link key={image._id} to={`/image/${image._id}`}>
                      <CardMedia
                        component="img"
                        height="194"
                        image={image.url}
                        alt={image.userName}
                      />
                    </Link>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
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
        </Container>
      </>
    );
  }
};

export default ImageList;
