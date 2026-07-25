import client from "./client";

export const authApi = {
  async register(payload) {
    const { data } = await client.post("/auth/register", payload);
    return data.data;
  },
  async login({ email, password }) {
    const { data } = await client.post("/auth/login", { email, password });
    return data.data; // { user, accessToken, refreshToken }
  },
  async me() {
    const { data } = await client.get("/auth/me");
    return data.data;
  },
  async logout(refreshToken) {
    const { data } = await client.post("/auth/logout", { refreshToken });
    return data;
  },
  async changePassword(payload) {
    const { data } = await client.post("/auth/change-password", payload);
    return data;
  },
  async forgotPassword(email) {
    const { data } = await client.post("/auth/forgot-password", { email });
    return data;
  },
};
