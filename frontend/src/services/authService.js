import api from "../api/axios";

const register = async (data) => (await api.post("/auth/register", data)).data;
const login = async (data) => (await api.post("/auth/login", data)).data;
const refresh = async () => (await api.post("/auth/refresh")).data;
const logout = async () => (await api.post("/auth/logout")).data;
const getMe = async () => (await api.get("/auth/me")).data;

export default {
  register,
  login,
  logout,
  refresh,
  getMe,
};
