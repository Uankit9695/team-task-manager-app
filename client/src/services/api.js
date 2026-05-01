import axios from "axios";

const API = axios.create({
  baseURL: "https://team-task-manager-app-1.onrender.com/api"  // 🔥 LIVE BACKEND
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = "Bearer " + token;  // 🔥 MUST
  }

  return req;
});

export default API;