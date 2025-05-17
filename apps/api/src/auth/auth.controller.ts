import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { LoggingInterceptor } from "src/common/interceptor/logging.interceptor/logging.interceptor";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { Request } from "express";
import { User } from "@prisma/client";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";

@UseInterceptors(LoggingInterceptor)
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req: Request & { user: User }) {
    // return req.user;
    return this.authService.login(req.user);
  }

  @Post("signup")
  signup(@Body() body: SignupDto) {
    // console.log("signup", body);
    return this.authService.signup(body);
  }

  @Get("session")
  @UseGuards(JwtAuthGuard)
  session(@Req() req: Request) {
    // console.log("session", req.);
    // return this.authService.session(req);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Post("forgot-password")
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  //* does not work on JWT strategy
  // @UseGuards(LocalAuthGuard)
  // @Post("logout")
  // async logout(@Req() req: Request) {
  //   return req.logout((err) => {
  //     console.log("err", err);
  //     if (err) {
  //       throw new InternalServerErrorException(
  //         `Logout failed: ${err?.message}`,
  //         {
  //           cause: err,
  //         }
  //       );
  //     }
  //     return {
  //       message: "Logout successful.",
  //     };
  //   });
  // }
}
