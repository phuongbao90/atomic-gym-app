import { useMutation } from "@tanstack/react-query";
import { login, signup } from "./auth.requests";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {},
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      // data.data.accessToken
    },
  });
};
