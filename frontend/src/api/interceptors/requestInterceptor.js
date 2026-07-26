import api from "../axios";
import { getAccessTokenForApi } from "../tokenManager";

api.interceptors.request.use(
  (config) => {
    const token = getAccessTokenForApi();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);
