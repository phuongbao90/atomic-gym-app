import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingProvider } from '../auth/provider/hashing.provider';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
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
  async getUserByUsername(username: string) {
    console.log('username: ', username);
    try {
      return this.prisma.user.findUnique({ where: { username } });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createUser(data: CreateUserDto) {
    // console.log('data: ', data);
    const hashedPassword = await this.hashingProvider.hashPassword(
      data.password,
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
}
