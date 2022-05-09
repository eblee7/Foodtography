import React from "react";

import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    let formAddress;
    let navigate = useNavigate();

    return (
        <div>
            <div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log(formAddress.value);
                        navigate(`restaurants/${formAddress.value}`);
                        formAddress.value = "";
                    }}
                >
                    <div>
                        <label>
                            Enter Address:
                            <br />
                            <input
                                required
                                ref={(node) => {
                                    formAddress = node;
                                }}
                                autoFocus={true}
                            />
                        </label>
                    </div>

                    <br />
                    {<button type="submit">Search nearby address</button>}
                </form>
            </div>
        </div>
    );
};

export default SearchBar;
