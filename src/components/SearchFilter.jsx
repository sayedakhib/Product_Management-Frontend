import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange }) => (
  <div className="mb-3 p-3 bg-white rounded-3 shadow-sm">
    <input
      type="text"
      className="form-control"
      placeholder="Search by name..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  </div>
);

export default SearchBar;
