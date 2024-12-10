export const api = $fetch.create({
  baseURL: "http://localhost:3000",
  headers: {
    // Authorization: `Bearer ${token}`,
  },
});

export function setAuthToken(token: string) {}
