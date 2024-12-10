import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { REQUEST_USER_KEY } from "src/auth/constant/auth.constant";
import { JwtUser } from "src/auth/type/jwt-user-type";
import { HashingProvider } from "../auth/provider/hashing.provider";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider
  ) {}
  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUser(id: number) {
    try {
      return this.prisma.user.findUnique({ where: { id } });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getUserByUsername(email: string) {
    try {
      return this.prisma.user.findUnique({ where: { email } });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createUser(data: CreateUserDto) {
    // console.log('data: ', data);
    const hashedPassword = await this.hashingProvider.hashPassword(
      data.password
    );
    try {
      return this.prisma.user.create({
        data: { ...data, password: hashedPassword },
      });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async me(req: Request) {
    try {
      const user: JwtUser = req[REQUEST_USER_KEY];
      console.log("user: ", user);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateMe(data: Partial<CreateUserDto>, req: Request) {
    const user: JwtUser = req[REQUEST_USER_KEY];
    console.log("user: ", user);
    return this.prisma.user.update({
      where: { id: user.sub },
      data: data,
    });
  }
}
