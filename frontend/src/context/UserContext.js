// context/UserContext.js
import { createContext, useContext } from "react";

// 1. Create the base context object
export const UserContext = createContext({
  user: null,
  accessToken: null,
  loading: false,
  isAuthenticated: false,
  setAccessToken: () => {},
  setLoading: () => {},
  setUser: () => {},
});

// 2. Custom hook for easier access across your app
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
