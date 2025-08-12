import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials),
};

export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId: string, quantity: number) =>
    api.post('/cart/add', { productId, quantity }),
  remove: (productId: string) => api.delete(`/cart/remove/${productId}`),
  update: (productId: string, quantity: number) =>
    api.put('/cart/update', { productId, quantity }),
};

export const orderAPI = {
  checkout: () => api.post('/checkout'),
  getOrders: () => api.get('/orders'),
};

export const adminAPI = {
  addProduct: (product: any) => api.post('/admin/products', product),
  updateProduct: (id: string, product: any) => api.put(`/admin/products/${id}`, product),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  getOrders: () => api.get('/admin/orders'),
};

export default api;