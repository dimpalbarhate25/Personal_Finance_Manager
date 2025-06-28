import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:5002/api", // adjust as needed
});

// Automatically attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Token attached:", token); // ✅ ADD THIS
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
