// components/FilterBar.js
import React from 'react';

const FilterBar = ({ search, setSearch, category, setCategory, sort, setSort }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-md mb-6">
      <input
        type="text"
        placeholder="Search by product name..."
        className="px-4 py-2 border rounded-md w-full md:w-1/3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-4 py-2 border rounded-md w-full md:w-1/4"
      >
        <option value="">All Categories</option>
        <option value="fruits">Fruits</option>
        <option value="vegetables">Vegetables</option>
      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="px-4 py-2 border rounded-md w-full md:w-1/4"
      >
        <option value="">Sort By Price</option>
        <option value="low">Low to High</option>
        <option value="high">High to Low</option>
      </select>
    </div>
  );
};

export default FilterBar;
