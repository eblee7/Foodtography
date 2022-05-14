import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";
import queries from "../queries";
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Typography,
    List,
    ListItem,
    Divider,
    ListItemText,
    Grid,
    CircularProgress,
    Button,
} from "@mui/material";
import ".././App.css";

const Image = () => {
    const { currentUser } = useAuth();
    const { id } = useParams();
    const [disabled, setDisable] = useState(true);
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

    const validateForm = (value) => {
        console.log(value, "value for form");
        if (!value || (value && value.trim().length === 0)) {
            console.log("enter disabled");
            setDisable(true);
        } else {
            setDisable(false);
        }
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
                    <Button
                        variant="contained"
                        component={Link}
                        to={`/restaurant/${image.rid}`}
                    >
                        To Restaurant
                    </Button>
                    <Card sx={{ maxWidth: 500 }}>
                        <CardHeader
                            title={image.userName}
                            // subheader="September 14, 2016" />
                        />
                        <CardMedia
                            component="img"
                            image={image.url}
                            alt="Paella dish"
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                {image.description}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* <Box sx={{ maxHeight: 500, overflow: "hidden", overflowY: "scroll" }}> */}
                    <List
                        sx={{
                            width: "100%",
                            maxWidth: 500,
                            maxHeight: 300,
                            overflow: "hidden",
                            overflowY: "scroll",
                        }}
                    >
                        {image.comments.map((comment, index) => {
                            return (
                                <div key={index}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={comment.userName}
                                            secondary={<>{comment.comment}</>}
                                        />
                                    </ListItem>
                                    <Divider sx={{ width: 500 }} />
                                </div>
                            );
                        })}
                    </List>
                    {/* </Box> */}
                    {currentUser ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addComment({
                                    variables: {
                                        userName: currentUser.displayName,
                                        imageID: id,
                                        comment: comment.value.replace(
                                            /<[^>]+>/g,
                                            ""
                                        ),
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
                                        onChange={() => {
                                            validateForm(comment.value);
                                        }}
                                        maxLength="140"
                                    />
                                </label>
                            </div>
                            <br />

                            {disabled ? (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled
                                >
                                    Add Comment
                                </Button>
                            ) : (
                                <Button type="submit" variant="contained">
                                    Add Comment
                                </Button>
                            )}
                            <br />
                            <br />
                        </form>
                    ) : (
                        <h2>Sign in to comment</h2>
                    )}
                </Grid>
            </Grid>
        );
    }
};

export default Image;
