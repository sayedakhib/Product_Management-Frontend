import React, { useEffect } from 'react';
import { searchProducts } from '../api/productApi';

const SearchFilter = ({ searchTerm, onSearchChange, category, onCategoryChange, categories, onSearchResults }) => {
  useEffect(() => {
    const fetchSearch = async () => {
      if (searchTerm) {
        const res = await searchProducts(searchTerm);
        if (onSearchResults) onSearchResults(res.data.products);
      }
    };
    fetchSearch();
    // Only run when searchTerm changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <div className="d-flex flex-column flex-md-row gap-2 mb-3 p-3 bg-white rounded-3 shadow-sm align-items-stretch">
      <input
        type="text"
        className="form-control"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className="form-select"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat, i) => (
          <option key={i} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilter;
