import client from "./client";
export const pipelinesApi = {
  async list(params={}) {
    const { data: res } = await client.get("/pipelines", { params });
    return { items: res.data || [] };
  },
};
