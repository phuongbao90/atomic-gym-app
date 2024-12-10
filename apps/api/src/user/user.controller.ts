import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { Auth } from "src/auth/decorator/auth.decorator";
import { AuthType } from "src/auth/type/auth-type";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get("me")
  @Auth(AuthType.Bearer)
  async getMe(@Req() req: Request) {
    return this.userService.me(req);
  }

  @Get(":id")
  async getUser(@Param("id") id: number) {
    return this.userService.getUser(id);
  }

  @Get("email/:email")
  @Auth(AuthType.None)
  async getUserByUsername(@Param("email") email: string) {
    return this.userService.getUserByUsername(email);
  }

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: number) {
    return this.userService.deleteUser(id);
  }

  @Put("me")
  async updateMe(@Req() req: Request, @Body() body: Partial<CreateUserDto>) {
    return this.userService.updateMe(body, req);
  }
}
