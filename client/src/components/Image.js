import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import queries from "../queries";
import { useAuth } from "../firebase/AuthContext";

const Image = () => {
    const { currentUser } = useAuth();
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
            console.log(comments);
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
        return (
            <div>
                <img alt="temp" src={image.url} />
                {currentUser ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            addComment({
                                variables: {
                                    userName: currentUser.userName,
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
                ) : (
                    <h2>Sign in to comment</h2>
                )}
                {image.comments.map((comment) => {
                    return (
                        <>
                            <p>{comment.userName}</p>
                            <p>{comment.comment}</p>
                        </>
                    );
                })}
            </div>
        );
    }
};

export default Image;
