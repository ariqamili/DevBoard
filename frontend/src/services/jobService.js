import api from "../api/axios";

const getJobs = async () => (await api.get("/jobs")).data;
const getJob = async (id) => (await api.get(`/jobs/${id}`)).data;
const createJob = async (data) => (await api.post("/jobs", data)).data;
const updateJob = async (id, data) => (await api.put(`/jobs/${id}`, data)).data;
const deleteJob = async (id) => (await api.delete(`/jobs/${id}`)).data;

export default {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
