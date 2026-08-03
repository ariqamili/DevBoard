import api from "../api/axios";

const createProfile = async (data) => (await api.post("/profile", data)).data;
const getMyProfile = async () => (await api.get("/profile/me")).data;
const updateMyProfile = async (data) =>
  (await api.put("/profile/me", data)).data;

export default {
  createProfile,
  getMyProfile,
  updateMyProfile,
};
