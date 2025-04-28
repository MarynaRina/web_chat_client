import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // динамічно з env
  withCredentials: true, // важливо для кукі і авторизації
});

export default api;