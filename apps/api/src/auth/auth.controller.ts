import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { Request } from "express";
import { LoggingInterceptor } from "src/common/interceptor/logging.interceptor/logging.interceptor";
import { AuthService } from "./auth.service";
import { Auth } from "./decorator/auth.decorator";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { AuthType } from "./type/auth-type";

@UseInterceptors(LoggingInterceptor)
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Auth(AuthType.None)
  login(@Body() body: LoginDto) {
    console.log("login", body);
    return this.authService.login(body);
  }

  @Post("signup")
  @Auth(AuthType.None)
  signup(@Body() body: SignupDto) {
    console.log("signup", body);
    return this.authService.signup(body);
  }

  @Get("session")
  @Auth(AuthType.Bearer)
  session(@Req() req: Request) {
    // console.log("session", req.);
    return this.authService.session(req);
  }
}
