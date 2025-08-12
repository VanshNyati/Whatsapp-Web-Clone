// frontend/src/api.js
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${backendUrl}/api`,
  timeout: 5000,
});

export default api;
