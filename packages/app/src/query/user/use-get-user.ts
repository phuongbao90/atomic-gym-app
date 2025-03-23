import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "../../configs/api-routes";
import { request } from "../../libs/request";
import { QUERY_KEYS } from "../keys";

export type User = {
  name: string;
  avatar: string | null;
  // jwt user
  sub: number;
  email: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
};

export function useGetUser(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.user(id),
    queryFn: () => getUser(id),
    enabled: !!id,
  });
}

export async function getUser(id: number) {
  try {
    const res = await request<User>(API_ROUTES.getUser(id), {
      method: "GET",
    });
    return res?.data;
  } catch (error) {
    console.error("error ", error);
  }
}
