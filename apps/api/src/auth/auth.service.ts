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
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { HashingProvider } from "./provider/hashing.provider";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  async login(body: LoginDto) {
    try {
      const existingUser = await this.userService.getUserByUsername(body.email);
      if (!existingUser) {
        throw new UnauthorizedException();
      }
      const isPasswordMatch = await this.hashingProvider.comparePassword(
        body.password,
        existingUser.password
      );
      if (!isPasswordMatch) {
        throw new UnauthorizedException();
      }
      return this.generateTokens(existingUser);
    } catch (error) {
      console.log("error ====> ", error);
      throw new Error(error);
    }
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

  async session(req: Request) {
    const accessToken = req.headers["authorization"];
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
