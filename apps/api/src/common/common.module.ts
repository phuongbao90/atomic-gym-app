import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';

@Global()
@Module({
  imports: [PrismaModule, JwtModule.registerAsync(jwtConfig.asProvider())],
  exports: [PrismaModule, JwtModule.registerAsync(jwtConfig.asProvider())],
})
export class CommonModule {}
