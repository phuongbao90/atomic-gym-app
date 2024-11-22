import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
// import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
// import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    // PrismaModule,
    // CommonModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
