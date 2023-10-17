import React, { useState, useContext } from "react";
import { useAppContext } from "../../Redux/appContext"; // Update with the actual path

const BootcampFilters = () => {
  const [filters, setFilters] = useState({
    name: '',
    price_gte: '', // Example: filter for price greater than or equal to
    select: '',
    sort: '',
    page: 1,
    limit: 25
  });

  const { getBootcamps } = useAppContext();

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  }

  const handleApplyFilters = () => {
    const { name, price_gte, select, sort, page, limit } = filters;
    console.log(filters)
    getBootcamps( name, price_gte, select, sort, page, limit);
  }

  return (
    <div>
      {/* Example: Filter by name */}
      <input 
        type="text" 
        name="name" 
        placeholder="Filter by name..." 
        value={filters.name} 
        onChange={handleInputChange}
      />

      {/* Example: Filter for price greater than or equal to */}
      <input 
        type="number" 
        name="price_gte" 
        placeholder="Min price..." 
        value={filters.price_gte} 
        onChange={handleInputChange}
      />

      {/* Dropdown for selecting fields */}
      <select name="select" value={filters.select} onChange={handleInputChange}>
        <option value="">Select fields...</option>
        <option value="name,location">Name and Location</option>
        <option value="description">Description</option>
        {/* Add more options as required */}
      </select>

      {/* Dropdown for sorting */}
      <select name="sort" value={filters.sort} onChange={handleInputChange}>
        <option value="">Sort by...</option>
        <option value="name">Name</option>
        <option value="-price">Price Descending</option>
        {/* Add more options as required */}
      </select>

      {/* Pagination inputs, you can also use dropdowns */}
      <input 
        type="number" 
        name="page" 
        placeholder="Page" 
        value={filters.page} 
        onChange={handleInputChange}
      />
      <input 
        type="number" 
        name="limit" 
        placeholder="Limit" 
        value={filters.limit} 
        onChange={handleInputChange}
      />

      <button onClick={handleApplyFilters}>Apply Filters</button>
    </div>
  );
}

export default BootcampFilters;