import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Auth } from "./decorator/auth.decorator";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { AuthType } from "./type/auth-type";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Auth(AuthType.None)
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post("signup")
  @Auth(AuthType.None)
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }
}
