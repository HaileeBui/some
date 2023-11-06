import React from "react";
import "./SearchBar.css";

const SearchBar = ({ searchText, onInputChange, onSubmit }) => {
  return (
    <form className="search-container" onSubmit={onSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Enter city name..."
        value={searchText}
        onChange={(e) => onInputChange(e.target.value)}
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
