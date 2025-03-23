import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "../../configs/api-routes";
import { JWT_ACCESS_TOKEN_TTL } from "../../configs/constants";
import { request } from "../../libs/request";
import { QUERY_KEYS } from "../keys";
import { User } from "./use-get-user";

export async function getMe() {
  try {
    return await request<User>(API_ROUTES.user.me, {
      method: "GET",
    });
  } catch (error) {
    console.error("error ", error);
  }
}

export const useGetMe = () => {
  return useQuery({
    queryKey: QUERY_KEYS.me,
    queryFn: () => getMe(),
    staleTime: JWT_ACCESS_TOKEN_TTL,
  });
};
