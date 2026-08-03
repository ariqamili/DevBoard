import { useEffect, useState, useCallback, useRef } from "react";
import authService from "../services/authService";
import { UserContext } from "./UserContext";
import { setAccessTokenForApi } from "../api/tokenManager";
import { registerLogoutCallback } from "../api/authEventManager";

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const isAuthenticated = !!user;

  const updateAccessToken = useCallback((token) => {
    setAccessToken(token);
    setAccessTokenForApi(token);
  }, []);

  const applyAuthentication = useCallback(
    (responseData) => {
      updateAccessToken(responseData.accessToken);
      setUser({
        id: responseData.id,
        email: responseData.email,
        role: responseData.role,
      });
    },
    [updateAccessToken],
  );

  const register = useCallback(
    async (credentials) => {
      const response = await authService.register(credentials);
      applyAuthentication(response.data);

      return response.data;
    },
    [applyAuthentication],
  );

  const login = useCallback(
    async (credentials) => {
      const response = await authService.login(credentials);
      applyAuthentication(response.data);

      return response.data;
    },
    [applyAuthentication],
  );

  const clearAuthState = useCallback(() => {
    setUser(null);
    updateAccessToken(null);
  }, [updateAccessToken]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // best-effort; state gets cleared regardless
    } finally {
      clearAuthState();
    }
  }, [clearAuthState]);

  useEffect(() => {
    registerLogoutCallback(clearAuthState);

    return () => registerLogoutCallback(null); // cleanup
  }, [clearAuthState]);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return; // StrictMode's second invocation — skip entirely
    hasInitialized.current = true;

    const initializeAuth = async () => {
      try {
        const response = await authService.refresh();
        applyAuthentication(response.data);
      } catch {
        clearAuthState();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [applyAuthentication, clearAuthState]);

  return (
    <UserContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        loading,

        register,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
