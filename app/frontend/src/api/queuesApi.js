import client from "./client";
export const queuesApi = {
  async list() {
    const { data: res } = await client.get("/queues");
    return { items: res.data || [] };
  },
};
