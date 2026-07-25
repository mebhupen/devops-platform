import client from "./client";

export const deploymentsApi = {
  async list(params = {}) {
    const { data: res } = await client.get("/deployments", { params });
    return { items: res.data || [], pagination: res.meta?.pagination || null };
  },
  async create(payload) {
    const { data: res } = await client.post("/deployments", payload);
    return res.data;
  },
};
