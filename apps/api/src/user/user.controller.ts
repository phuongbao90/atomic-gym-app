import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request) {
    return this.userService.me(req);
  }

  @Get(":id")
  async getUser(@Param("id") id: string) {
    return this.userService.getUser(id);
  }

  @Get("email/:email")
  @UseGuards(JwtAuthGuard)
  async getUserByUsername(@Param("email") email: string) {
    return this.userService.getUserByUsername(email);
  }

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: string) {
    return this.userService.deleteUser(id);
  }

  @Put("me")
  async updateMe(@Req() req: Request, @Body() body: Partial<CreateUserDto>) {
    return this.userService.updateMe(body, req);
  }
}
