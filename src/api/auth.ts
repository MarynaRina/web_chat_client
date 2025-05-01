import api from "../axios";

export const registerWithToken = async (token: string) => {
  return api.post("/api/auth/register", {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};