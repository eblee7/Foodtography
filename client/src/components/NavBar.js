import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    MenuItem,
} from "@mui/material";

const NavBar = () => {
    const { currentUser } = useAuth();
    return (
        <AppBar position="static">
            <Toolbar variant="dense">
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                ></IconButton>
                <Typography sx={{ fontSize: 35 }}>Foodtography</Typography>

                <MenuItem component={Link} to="/">
                    <Typography textAlign="center">Home</Typography>
                </MenuItem>

                {currentUser ? (
                    <MenuItem component={Link} to="/account">
                        <Typography textAlign="center">Account</Typography>
                    </MenuItem>
                ) : (
                    <MenuItem component={Link} to="/signin">
                        <Typography textAlign="center">Sign In</Typography>
                    </MenuItem>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
