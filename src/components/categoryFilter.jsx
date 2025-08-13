import React from 'react';

const CategoryFilter = ({ category, onCategoryChange, categories }) => (
	<div className="mb-3 p-3 bg-white rounded-3 shadow-sm">
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

export default CategoryFilter;
