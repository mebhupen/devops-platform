import client from "./client";

// Backend envelope: { success, message, data, meta: { pagination } }
export const projectsApi = {
  async list(params = {}) {
    const { data: res } = await client.get("/projects", { params });
    return { items: res.data || [], pagination: res.meta?.pagination || null };
  },
  async get(id) {
    const { data: res } = await client.get(`/projects/${id}`);
    return res.data;
  },
  async create(payload) {
    const { data: res } = await client.post("/projects", payload);
    return res.data;
  },
  async update(id, payload) {
    const { data: res } = await client.put(`/projects/${id}`, payload);
    return res.data;
  },
  async remove(id) {
    const { data: res } = await client.delete(`/projects/${id}`);
    return res;
  },
};
