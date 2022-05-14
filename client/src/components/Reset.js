import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { useAuth } from "../firebase/AuthContext";
import { Link } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
    Avatar,
    Button,
    TextField,
    Box,
    Typography,
    Grid,
} from "@mui/material";

function Reset() {
    const { resetPassword } = useAuth();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const data = new FormData(e.currentTarget);
            setMessage("");
            setError("");
            await resetPassword(data.get("email"));
            setMessage("Check your inbox for further instructions");
        } catch {
            setError("Failed to reset password");
        }
    }

    return (
        <>
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Password Reset
                </Typography>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Send Password Reset
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link to="/signup">
                                Don't have an account? Register
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
}

export default Reset;
