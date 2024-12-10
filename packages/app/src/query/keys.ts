export const QUERY_KEYS = {
  session: ["session"],
  me: ["me"],
  user: (id: number) => ["user", id],
};
