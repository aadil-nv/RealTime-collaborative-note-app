import axios from "axios";

const BACKEND_URL = "http://localhost:7000/api";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
