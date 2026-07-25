import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  timeout: 10000,
});

export const getDashboard = async () => {
  const { data } = await api.get("/docker/dashboard");
  return data;
};

export const getContainers = async () => {
  const { data } = await api.get("/docker/containers");
  return data;
};

export const getImages = async () => {
  const { data } = await api.get("/docker/images");
  return data;
};

export const getEvents = async () => {
  const { data } = await api.get("/docker/events");
  return data;
};

export const startContainer = async (id) => {
  const { data } = await api.post(`/docker/start/${id}`);
  return data;
};

export const stopContainer = async (id) => {
  const { data } = await api.post(`/docker/stop/${id}`);
  return data;
};

export const restartContainer = async (id) => {
  const { data } = await api.post(`/docker/restart/${id}`);
  return data;
};

export const removeContainer = async (id) => {
  const { data } = await api.delete(`/docker/container/${id}`);
  return data;
};

export default api;
