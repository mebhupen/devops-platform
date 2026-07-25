import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  timeout: 10000,
});

export const dashboardService = {
  async getDashboard() {
    const { data } = await api.get("/dashboard");
    return data;
  },

  async getTasks() {
    const { data } = await api.get("/tasks");
    return data;
  },

  async getDeployments() {
    const { data } = await api.get("/deployments");
    return data;
  },

  async getAlerts() {
    const { data } = await api.get("/alerts");
    return data;
  },

  async getMetrics() {
    const { data } = await api.get("/metrics");
    return data;
  },
};

export default api;
