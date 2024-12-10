import { useMutation } from "@tanstack/react-query";
import { request, setAccessToken } from "../../libs/request";

type RegisterInput = {
  email: string;
  password: string;
  name: string;
};

export type RegisterResponse = {
  accessToken: string;
  refreshToken: string;
};

export const register = async (input: RegisterInput) => {
  try {
    const res = await request<RegisterResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
      includeToken: false,
    });

    return res?.data;
  } catch (error) {
    console.error("error ", error);
  }
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAccessToken(data!.accessToken);
    },
  });
};
