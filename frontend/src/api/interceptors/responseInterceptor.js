import authService from "../../services/authService";
import { setAccessTokenForApi } from "../tokenManager";
import { triggerLogout } from "../authEventManager";

let refreshPromise = null;

export default function setupResponseInterceptor(api) {
  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      if (originalRequest.url?.includes("/auth/refresh")) {
        setAccessTokenForApi(null);
        triggerLogout();
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          if (!refreshPromise) {
            refreshPromise = authService
              .refresh()
              .finally(() => (refreshPromise = null));
          }

          const response = await refreshPromise;

          setAccessTokenForApi(response.data.accessToken);

          return api(originalRequest);
        } catch (refreshError) {
          setAccessTokenForApi(null);
          triggerLogout();

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
}
