import React from "react";
import ".././App.css";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  let formAddress;
  let navigate = useNavigate();

  return (
    <div className="container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(formAddress.value);
          navigate(`restaurants/${formAddress.value}`);
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
            sx={{ ml: 1, flex: 1 }}
            placeholder="Enter your location"
            inputProps={{ "aria-label": "Enter your location" }}
            inputRef={(node) => {
              formAddress = node;
            }}
          />
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </form>
    </div>
  );
};

export default SearchBar;
