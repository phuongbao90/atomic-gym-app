import { Inject, Injectable } from "@nestjs/common";
import type { Auth } from "better-auth/auth";
import { AUTH_INSTANCE_KEY } from "./constant/auth.constants";

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_INSTANCE_KEY)
    private readonly auth: Auth
  ) {}

  get api() {
    return this.auth.api;
  }
}
