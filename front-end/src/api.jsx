// src/api.jsx
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// Add request interceptor for debugging
API.interceptors.request.use(request => {
  console.log('API Request:', request.method.toUpperCase(), request.baseURL + request.url);
  return request;
});

// Add response interceptor for debugging
API.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.message, error.response?.data);
    return Promise.reject(error);
  }
);

export default API;
