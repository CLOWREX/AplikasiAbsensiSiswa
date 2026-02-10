import axios from "axios";

const api = axios.create({
  baseURL: "http://10.10.18.236:8004",
  withCredentials: false, 
  timeout: 3000, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
    }

    return Promise.reject(error);
  }
);

export default api;
