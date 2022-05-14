import React from "react";
import "./App.css";
import { Link, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
// import SignIn from "./components/SignIn";
import SearchBar from "./components/SearchBar";
import Image from "./components/Image";
import Restaurant from "./components/Restaurant";
import RestaurantList from "./components/RestaurantList";
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
        <div>
          <div>
            <header>
              <AppBar position="static">
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
              </AppBar>
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

              {/* copied from lecture slides might need to change format */}
              {/* <Route path="/home" element={<PrivateRoute />}> */}
              {/* <Route path="/home" element={<Home />} /> */}
              {/* </Route> */}
              {/* <Route path="/account" element={<PrivateRoute />}> */}
              {/* <Route path="/account" element={<Account />} /> */}
              {/* </Route> */}
              {/* copied from lecture slides might need to change format */}
              {/* 
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} /> */}
              {/* <Route
                                path="/image/food/page/:pagenum"
                                element={<ImageList />}
                            />
                            <Route
                                path="/image/atmosphere/page/:pagenum"
                                element={<ImageList />}
                            /> */}
              <Route path="/image/:id" element={<Image />} />
              <Route
                path="/restaurants/:address"
                element={<RestaurantList />}
              />
              <Route path="/restaurant/:id" element={<Restaurant />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
