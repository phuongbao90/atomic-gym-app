import { API_ROUTES } from "../../configs/api-routes"
import { request } from "../../libs/request"
import { ApiResponse } from "../../types/meta"
import { LoginInput, LoginResponse, RegisterInput } from "./auth.types"

export const login = async (input: LoginInput) => {
  return request<ApiResponse<LoginResponse>>(API_ROUTES.auth.login, {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export const signup = async (input: RegisterInput) => {
  return request<ApiResponse<LoginResponse>>(API_ROUTES.auth.signup, {
    method: "POST",
    body: JSON.stringify(input),
  })
}
