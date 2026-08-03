import api from "../api/axios";

const apply = async (jobId, data) =>
  (await api.post(`/applications/${jobId}`, data)).data;

const getMine = async () => (await api.get("/applications/my")).data;

const getCompany = async () => (await api.get("/applications/company")).data;

const updateStatus = async (id, status) =>
  (await api.patch(`/applications/${id}/status`, { status })).data;

export default {
  apply,
  getMine,
  getCompany,
  updateStatus,
};
