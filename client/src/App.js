import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./firebase/AuthContext";
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
                        <header>
                            <h1>Foodtography</h1>
                            <NavBar />
                            <SearchBar />
                        </header>
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
                                <Route
                                    path="/restaurant/:id"
                                    element={<Restaurant />}
                                />
                                <Route
                                    path="/account"
                                    element={<PrivateRoute />}
                                >
                                    <Route
                                        path="/account"
                                        element={<Account />}
                                    />
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
