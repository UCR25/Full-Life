// src/api.jsx
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://host.docker.internal:8000",
});

export default API;
