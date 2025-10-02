import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// export const apiPublic = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/v1/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});
