// src/api/axiosInstance.js

import axios from "axios";

// point this at your backend base URL
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
});

// before each request, grab the token & attach it
axiosInstance.interceptors.request.use(
  (config) => {
    // your login flow stores { token: "...", user: { _id, ... } } in localStorage
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const { token } = JSON.parse(stored);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        // malformed JSON, ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
