import React, { useState } from 'react';

const ProductForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    name: initialData.name || '',
    unit: initialData.unit || '',
    category: initialData.category || '',
    brand: initialData.brand || '',
    stock: initialData.stock || '',
    status: initialData.status || '',
    image: initialData.image || ''
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
  <form onSubmit={handleSubmit} className="p-3 border rounded-3 bg-white shadow-sm">
  <div className="mb-3">
        <input className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      </div>
  <div className="mb-3">
        <input className="form-control" name="unit" value={form.unit} onChange={handleChange} placeholder="Unit" required />
      </div>
  <div className="mb-3">
        <input className="form-control" name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
      </div>
  <div className="mb-3">
        <input className="form-control" name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" required />
      </div>
  <div className="mb-3">
        <input className="form-control" name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" required />
      </div>
  <div className="mb-3">
        <select className="form-select" name="status" value={form.status} onChange={handleChange}>
          <option value="">Select Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>
      <div className="mb-2">
        <input type="file" className="form-control" name="image" accept="image/*" onChange={handleChange} />
      </div>
  <button type="submit" className="btn btn-success w-100 shadow-sm">Save</button>
    </form>
  );
};

export default ProductForm;
