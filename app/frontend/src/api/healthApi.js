import client from "./client";

export const healthApi = {
  async check() {
    const { data } = await client.get("/health");
    return data;
  },
};
