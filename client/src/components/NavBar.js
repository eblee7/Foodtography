import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";

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

export default NavBar;
