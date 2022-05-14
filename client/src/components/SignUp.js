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
const SignUp = () => {
    const { signup, signInWithGoogle, currentUser } = useAuth();
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        if (data.get("password") !== data.get("passwordConfirm")) {
            return setError("Passwords do not match");
        }

        try {
            setError("");

            await signup(
                data.get("Name"),
                data.get("email"),
                data.get("password")
            );
            navigate("/account");
        } catch {
            setError("Failed to create an account");
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
                    Sign up
                </Typography>
                {error && <Alert variant="danger">{error}</Alert>}
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 1 }}
                >
                    <TextField
                        autoComplete="given-name"
                        margin="normal"
                        // ref={nameRef}
                        name="Name"
                        required
                        fullWidth
                        id="Name"
                        label="Name"
                        autoFocus
                    />
                    <TextField
                        required
                        margin="normal"
                        fullWidth
                        // ref={emailRef}
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                    />
                    <TextField
                        required
                        margin="normal"
                        fullWidth
                        // ref={passwordRef}
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                    />
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        // ref={passwordConfirmRef}
                        name="passwordConfirm"
                        label="Password Confirm"
                        type="password"
                        id="passwordConfirm"
                        autoComplete="new-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Button
                        fullWidth
                        variant="outline"
                        onClick={signInUsingGoogleAccount}
                    >
                        Register with Google
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/signin">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
};

export default SignUp;
