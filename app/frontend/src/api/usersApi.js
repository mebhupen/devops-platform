import client from "./client";
export const usersApi = {
  async list(params={}) {
    const { data: res } = await client.get("/users", { params });
    return { items: res.data || [], pagination: res.meta?.pagination || null };
  },
};
