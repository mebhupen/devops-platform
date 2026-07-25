import client from "./client";
export const jobsApi = {
  async list() {
    const { data: res } = await client.get("/jobs");
    return { items: res.data || [] };
  },
};
