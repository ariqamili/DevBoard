import axios from "axios";

import setupRequestInterceptor from "./interceptors/requestInterceptor";
import setupResponseInterceptor from "./interceptors/responseInterceptor";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

setupRequestInterceptor(api);
setupResponseInterceptor(api);

export default api;
