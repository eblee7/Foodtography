import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

const NavBar = () => {
  const { currentUser } = useAuth();
  return (
    <nav>
      <NavLink to="/">Foodtography</NavLink>
      {currentUser ? (
        <NavLink to="/account">Account</NavLink>
      ) : (
        <NavLink to="/signin">Sign In</NavLink>
      )}
    </nav>
  );
};

{
  /* <AppBar position="static">
<Toolbar variant="dense">
  <IconButton
    edge="start"
    color="inherit"
    aria-label="menu"
    sx={{ mr: 2 }}
  ></IconButton>
  <Typography variant="h4">Foodtography</Typography>

  <MenuItem component={Link} to="/">
    <Typography textAlign="center">Home</Typography>
  </MenuItem>

  <MenuItem component={Link} to="/login">
    <Typography textAlign="center">Login</Typography>
  </MenuItem>
</Toolbar>
</AppBar> */
}
export default NavBar;
