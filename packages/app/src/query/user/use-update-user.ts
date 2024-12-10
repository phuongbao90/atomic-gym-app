import { useMutation } from "@tanstack/react-query";
import { request } from "../../libs/request";
import { User } from "./use-get-user";

export function updateUser(user: User) {
  return request<User>("/user/me", {
    method: "PUT",
    body: JSON.stringify(user),
  });
}

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: (user: User) => updateUser(user),
  });
};
