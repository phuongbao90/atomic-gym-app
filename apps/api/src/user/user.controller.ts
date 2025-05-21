import { Controller, Delete, Get, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { PublicRoute } from "../common/decorator/public-route.decorator";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PublicRoute()
  @Get(":id")
  async getUser(@Param("id") id: string) {
    return this.userService.getUser(id);
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: string) {
    return this.userService.deleteUser(id);
  }
}
