import client from "./client";

export const notificationsApi = {
  async list(params = {}) {
    const { data: res } = await client.get("/notifications", { params });
    return { items: res.data || [], pagination: res.meta?.pagination || null };
  },
  async markRead(id) {
    const { data: res } = await client.patch(`/notifications/${id}/read`);
    return res.data;
  },
};
