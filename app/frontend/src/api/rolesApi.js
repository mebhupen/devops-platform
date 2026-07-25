import client from "./client";
export const rolesApi = {
  async list() {
    const { data: res } = await client.get("/roles");
    return { items: res.data || [] };
  },
};
