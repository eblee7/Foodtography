import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { useAuth } from "../firebase/AuthContext";
import { Link, useNavigate, Navigate } from "react-router-dom";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import {
    Avatar,
    Button,
    TextField,
    Grid,
    Box,
    Typography,
} from "@mui/material";

const SignIn = () => {
    const { login, signInWithGoogle, currentUser } = useAuth();
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            const data = new FormData(e.currentTarget);
            await login(data.get("email"), data.get("password"));
            navigate("/account");
        } catch {
            setError("Failed to log in");
        }
    }

    async function signInUsingGoogleAccount() {
        try {
            await signInWithGoogle();
            navigate("/account");
        } catch {
            setError("Failed to create an account");
        }
    }
    if (currentUser) {
        return <Navigate to="/account" />;
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
                    Sign in
                </Typography>
                {error && <Alert variant="danger">{error}</Alert>}
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
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Button
                        fullWidth
                        variant="outline"
                        onClick={signInUsingGoogleAccount}
                    >
                        Login with Google
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link to="/reset">Forgot Password?</Link>
                        </Grid>
                        <Grid item>
                            <Link to="/signup">
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
};

export default SignIn;
