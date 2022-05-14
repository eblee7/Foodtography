import React from "react";
import "./App.css";
import { AuthProvider } from "./firebase/AuthContext";
import { Link, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import SearchBar from "./components/SearchBar";
import Image from "./components/Image";
import Restaurant from "./components/Restaurant";
import RestaurantList from "./components/RestaurantList";
import SignUp from "./components/SignUp";
import Account from "./components/Account";
import SignIn from "./components/SignIn";
import PrivateRoute from "./components/PrivateRoute";
import Reset from "./components/Reset";
import NavBar from "./components/NavBar";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

// import MenuIcon from '@mui/icons-material/Menu';
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new createUploadLink({
    uri: "http://localhost:4000",
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <AuthProvider>
          <div>
            <div>
              <header>
                <NavBar />
              </header>
            </div>
            <div>
              <SearchBar />
            </div>
            <br />
            <br />
            <div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/image/:id" element={<Image />} />
                <Route
                  path="/restaurants/:address"
                  element={<RestaurantList />}
                />
                <Route path="/restaurant/:id" element={<Restaurant />} />
                <Route path="/account" element={<PrivateRoute />}>
                  <Route path="/account" element={<Account />} />
                </Route>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/reset" element={<Reset />} />
              </Routes>
            </div>
          </div>
        </AuthProvider>
      </Router>
    </ApolloProvider>
  );
}

export default App;
