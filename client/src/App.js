import React, { useState } from "react";
import "./App.css";
import {
    NavLink,
    BrowserRouter as Router,
    Route,
    Routes,
} from "react-router-dom";
import Home from "./components/Home";
// import SignIn from "./components/SignIn";
import SearchBar from "./components/SearchBar";
import ImageList from "./components/ImageList";
import Image from "./components/Image";
import Restaurant from "./components/Restaurant";
import RestaurantList from "./components/RestaurantList";
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
            <Router>
                <div>
                    <header>
                        <h1>Foodtography</h1>
                        <nav>
                            <NavLink to="/">Foodtography</NavLink>
                            <NavLink to="/login">Login</NavLink>
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
                            <Route path="/image/:id" element={<Image />} />
                            <Route
                                path="/restaurant/"
                                element={<RestaurantList />}
                            />
                            <Route
                                path="/restaurant/:id"
                                element={<Restaurant />}
                            />
                        </Routes>
                    </div>
                </div>
            </Router>
        </ApolloProvider>
    );
}

export default App;
