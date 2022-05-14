import React, { useState } from "react";
import ".././App.css";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import {
    Paper,
    InputBase,
    IconButton,
    FormControl,
    Alert,
} from "@mui/material";

const SearchBar = () => {
    let formAddress;
    let navigate = useNavigate();
    const [disabled, setDisable] = useState(false);
    const [error, setError] = useState(false);

    const validateForm = (value) => {
        console.log(value, "value for form");
        if (!value || (value && value.trim().length === 0)) {
            setDisable(true);
            setError(true);
        } else {
            setDisable(false);
            setError(false);
        }
    };
    return (
        <div className="container">
            {error && <br />}
            {error && <Alert severity="error">Invalid search</Alert>}
            {error && <br />}
            <FormControl>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        validateForm(formAddress.value);
                        console.log(formAddress.value);
                        navigate(
                            `restaurants/${formAddress.value.replace(
                                /<[^>]+>/g,
                                ""
                            )}`
                        );
                        formAddress.value = "";
                    }}
                >
                    <Paper
                        sx={{
                            p: "2px 4px",
                            display: "flex",
                            alignItems: "center",
                            width: 400,
                        }}
                    >
                        <InputBase
                            required
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Enter a location"
                            inputProps={{ "aria-label": "Enter a location" }}
                            error={true}
                            inputRef={(node) => {
                                formAddress = node;
                            }}
                            onChange={() => validateForm(formAddress.value)}
                        />
                        <IconButton
                            disabled={disabled}
                            type="submit"
                            sx={{ p: "10px" }}
                            aria-label="search"
                        >
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </form>
            </FormControl>
        </div>
    );
};

export default SearchBar;
