import React, { useState } from "react";
import "./App.css";
import {
    NavLink,
    BrowserRouter as Router,
    Route,
    Routes,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./components/Home";
import SearchBar from "./components/SearchBar";
import ImageList from "./components/ImageList";
import Image from "./components/Image";
import Restaurant from "./components/Restaurant";
import RestaurantList from "./components/RestaurantList";
import Signup from "./components/SignUp";
import Account from "./components/Account";
import SignIn from "./components/SignIn";
import PrivateRoute from "./components/PrivateRoute";
import Reset from "./components/Reset";
import UpdateProfile from "./components/UpdateProfile";

import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    ApolloProvider,
} from "@apollo/client";
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: "http://localhost:4000",
    }),
});

function App() {
    return (
        <ApolloProvider client={client}>
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <Router>
                <AuthProvider>
                <div>
                    <header>
                        <h1>Foodtography</h1>
                        <nav>
                            <NavLink to="/">Foodtography</NavLink>
                            <NavLink to="/signin">Login</NavLink>
                        </nav>
                        <SearchBar />
                    </header>
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
                            <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>}></Route>
                            <Route path="/update-profile" element={<PrivateRoute><UpdateProfile/></PrivateRoute>}></Route>
                            <Route path="/signup" element={<Signup/>} />
                            <Route path="/signin" element={<SignIn/>} />
                            <Route path="/reset" element={<Reset/>} />
                            <Route path="/image/:id" element={<Image />} />
                            <Route
                                path="/restaurants/:address"
                                element={<RestaurantList />}
                            />
                            <Route
                                path="/restaurant/:id"
                                element={<Restaurant />}
                            />
                        </Routes>
                    </div>
                </div>
                </AuthProvider>
            </Router>
            </Container>
        </ApolloProvider>
    );
}

export default App;
