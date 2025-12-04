import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL: (import.meta.env.AUTH_SERVICE_API as string) ?? "http://localhost:8080/api", // Change this to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Needed if using cookies for OAuth2
});

// Add JWT token automatically if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  console.log(config)
  if (token && token != "undefined" && config.headers) {
    console.log("Adding token to request:", token);
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers && config.headers.Authorization) {
    // Remove Authorization header if no token
    console.log("REMoving header before call")
    delete config.headers.Authorization;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {

    if (error.response?.status === 401 &&
      !error.config.url?.endsWith("/refresh")) {
      console.warn("Unauthorized! Attempting to refresh token...");
      try {
        // Call your refresh token endpoint
        const refreshResponse = await api.post("/refresh", {});
        const newToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newToken); //access token set

        // Retry the original request with the new token
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api.request(error.config);
      } catch (refreshError) {
        alert("Login failed!\n Username or Password incorrect");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
