import axios, { AxiosRequestConfig } from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),
  register: (userData: { name: string; email: string; password: string }) =>
    api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/profile"),
};

export const itemsAPI = {
  getAllItems: () => api.get("/items"),
  getItemById: (id: string) => api.get(`/items/${id}`),
  createItem: (itemData: any) => api.post("/items", itemData),
  updateItem: (id: string, itemData: any) => api.put(`/items/${id}`, itemData),
  deleteItem: (id: string) => api.delete(`/items/${id}`),
  uploadItemImage: (id: string, formData: FormData) =>
    api.post(`/items/${id}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const imageAnalysisAPI = {
  analyzeImage: (formData: FormData) => {
    return axios.post("/api/analyze-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default api;
