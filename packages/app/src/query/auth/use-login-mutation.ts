// import { useMutation } from "@tanstack/react-query";
// import { API_ROUTES } from "../../configs/api-routes";
// import { request, setAccessToken } from "../../libs/request";

// export type LoginInput = {
//   email: string;
//   password: string;
// };

// export type LoginResponse = {
//   accessToken: string;
//   refreshToken: string;
// };

// export const login = async (input: LoginInput) => {
//   try {
//     const res = await request<LoginResponse>(API_ROUTES.auth.login, {
//       method: "POST",
//       body: JSON.stringify(input),
//       includeToken: false,
//     });

//     if (res?.data) {
//       setAccessToken(res.data.accessToken);
//     }
//     return res?.data;
//   } catch (error) {
//     console.error("error ", error);
//   }
// };

// export const useLoginMutation = () => {
//   return useMutation({
//     mutationFn: login,
//     onSuccess: (data) => {
//       setAccessToken(data!.accessToken);
//     },
//   });
// };
