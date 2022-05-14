import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import queries from "../queries";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ".././App.css";

const Image = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(queries.GET_IMAGE, {
    variables: { imageID: id },
  });
  const [addComment] = useMutation(queries.ADD_COMMENT, {
    update(cache, { data: { addComment } }) {
      const { image } = cache.readQuery({
        query: queries.GET_IMAGE,
        variables: { imageID: id },
      });
      let comments = image.comments;
      cache.writeQuery({
        query: queries.GET_IMAGE,
        data: {
          image: comments.concat([addComment]),
        },
        variables: { imageID: id },
      });
    },
  });

  if (loading) return "Loading...";

  if (error) return `Error! ${error.message}`;

  let comment;

  if (data) {
    const { image } = data;
    console.log(image);
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
        spacing={{ xs: 2, md: 2 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item xs={12}>
          <Card sx={{ minWidth: 500 }}>
            <CardHeader
              title={image.userName}
              // subheader="September 14, 2016" />
            />
            <CardMedia component="img" image={image.url} alt="Paella dish" />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {image.description}
              </Typography>
            </CardContent>
          </Card>

          <List
            sx={{
              width: "100%",
              maxWidth: 360,
            }}
          >
            {image.comments.map((comment) => {
              return (
                <>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={comment.userName}
                      secondary={<>{comment.comment}</>}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </>
              );
            })}
          </List>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addComment({
                variables: {
                  userName: "1234",
                  imageID: id,
                  comment: comment.value,
                },
              });
              comment.value = "";
            }}
          >
            <div>
              <label>
                Comment
                <br />
                <input
                  ref={(node) => {
                    comment = node;
                  }}
                  required
                />
              </label>
            </div>
            <br />

            <button type="submit">Add Comment</button>
          </form>
        </Grid>
      </Grid>
    );
  }
};

export default Image;
