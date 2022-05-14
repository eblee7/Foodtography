import React from "react";
import { Grid, Alert, AlertTitle } from "@mui/material";
const Error = () => {
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
};

export default Error;
