import axios from "axios";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  Book,
  CreateBookData,
  UpdateBookData,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_BASE_URL_API;

console.log("API_BASE_URL:", API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for 401 errors on protected routes (not auth routes)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};

// Books API
export const booksAPI = {
  getAllBooks: async (): Promise<Book[]> => {
    const response = await api.get("/books");
    return response.data;
  },

  getMyBooks: async (): Promise<Book[]> => {
    const response = await api.get("/books/my-books");
    return response.data;
  },

  getBook: async (id: number): Promise<Book> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  createBook: async (bookData: CreateBookData): Promise<Book> => {
    const response = await api.post("/books", bookData);
    return response.data;
  },

  updateBook: async (id: number, bookData: UpdateBookData): Promise<Book> => {
    const response = await api.patch(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id: number): Promise<void> => {
    await api.delete(`/books/${id}`);
  },
};

export default api;
