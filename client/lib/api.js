import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API ||
    process.env.REACT_APP_API ||
    "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
