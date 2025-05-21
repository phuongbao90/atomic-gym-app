import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: string) {
    try {
      return this.prisma.user.findUnique({ where: { id } });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
