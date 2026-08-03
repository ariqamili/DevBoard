import { getAccessTokenForApi } from "../tokenManager";

export default function setupRequestInterceptor(api) {
  api.interceptors.request.use(
    (config) => {
      const token = getAccessTokenForApi();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
}
