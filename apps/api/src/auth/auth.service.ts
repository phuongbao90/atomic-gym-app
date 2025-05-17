import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { Request } from "express";
import jwtConfig from "../config/jwt.config";
import { UserService } from "../user/user.service";
import { REQUEST_USER_KEY } from "./constant/auth.constant";
import { SignupDto } from "./dto/signup.dto";
import { HashingProvider } from "./provider/hashing.provider";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { MailService } from "../mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly mailService: MailService
  ) {}

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      expiresInSeconds: this.jwtConfiguration.accessTokenTtl,
      refreshToken: this.jwtService.sign(payload),
      refreshTokenExpiresInSeconds: this.jwtConfiguration.refreshTokenTtl,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByUsername(email);
    if (!user) {
      return null;
    }
    const isPasswordMatch = await this.hashingProvider.comparePassword(
      password,
      user.password
    );
    if (!isPasswordMatch) {
      return null;
    }
    return user;
  }

  async signup(body: SignupDto) {
    // console.log('body', body);
    try {
      const existingUser = await this.userService.getUserByUsername(body.email);
      if (existingUser) {
        throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
      }
      try {
        const user = await this.userService.createUser(body);
        return this.generateTokens(user);
      } catch (error) {
        throw new Error(error);
      }
    } catch (error) {
      console.log("error ====> ", error);
      throw new Error(error);
    }
  }

  public async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(user.id, +this.jwtConfiguration.accessTokenTtl, {
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      }),
      this.signToken(user.id, +this.jwtConfiguration.refreshTokenTtl),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
  public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    const token = await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        audience: this.jwtConfiguration.audience,
        expiresIn,
      }
    );

    return token;
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const user = await this.userService.getUserByUsername(body.email);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const token = await this.signToken(
      user.id,
      +this.jwtConfiguration.accessTokenTtl
    );

    await this.mailService.sendPasswordReset(
      user.email,
      `${process.env.WEB_URL}/reset-password?token=${token}`
    );

    return {
      resetPasswordToken: token,
      expiresInSeconds: this.jwtConfiguration.accessTokenTtl,
    };
  }

  async session(req: Request) {
    const accessToken = req.headers.authorization;
    const user = req[REQUEST_USER_KEY];

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      accessToken,
      user: user,
    };
  }
}
