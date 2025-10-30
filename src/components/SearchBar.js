import React, { useState } from 'react';


const SearchBar = ({ onSearch, isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
  };

  return (
    <form className={`search-bar ${isDarkMode ? 'dark' : 'light'}`} onSubmit={handleSearch}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search JSON path (e.g., $.user.address.city)"
        className={`search-input ${isDarkMode ? 'dark' : 'light'}`}
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
};

export default SearchBar;