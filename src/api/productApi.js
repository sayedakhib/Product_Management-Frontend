
import axios from 'axios';

const API = axios.create({ baseURL: 'https://product-api-vplu.onrender.com/api/products' });

export const getAllCategories = () => API.get('/categories');
export const getProductsByCategory = (category, params = {}) =>
	API.get('/category', { params: { category, ...params } });
export const searchProducts = (name) => API.get(`/search`, { params: { name } });
export const getProducts = (params) => API.get('/', { params });
export const addProduct = (data) => API.post('/add', data);
export const updateProduct = (id, data) => API.put(`/${id}`, data);
export const deleteProduct = (id) => API.delete(`/delete/${id}`);
export const importProducts = (formData) => API.post('/import', formData);
export const exportProducts = () => API.get('/export', { responseType: 'blob' });
export const getHistory = (id) => API.get(`/${id}/history`);
