import "./App.css";
import {
    NavLink,
    BrowserRouter as Router,
    Route,
    Routes,
} from "react-router-dom";
import Home from "./components/Home";
import SignIn from "./components/SignIn";

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Pokemon API</h1>
                    <nav>
                        <NavLink className="" to="/">
                            Foodtography
                        </NavLink>
                        <NavLink className="" to="/login">
                            Login
                        </NavLink>
                    </nav>
                </header>
                <br />
                <br />
                <div className="App-body">
                    <Routes>
                        <Route path="/" element={<Home />} />

                        {/* copied from lecture slides might need to change format */}
                        <Route path="/home" element={<PrivateRoute />}>
                            <Route path="/home" element={<Home />} />
                        </Route>
                        <Route path="/account" element={<PrivateRoute />}>
                            <Route path="/account" element={<Account />} />
                        </Route>
                        {/* copied from lecture slides might need to change format */}

                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route
                            path="/image/page/:pagenum"
                            element={<ImageList />}
                        />
                        <Route path="/image/:id" element={<Image />} />
                        <Route
                            path="/restaurant/page/:pagenum"
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
    );
}

export default App;
