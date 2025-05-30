import { Prisma } from "@prisma/client";
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsEmail({}, { message: "Email không hợp lệ" })
  email: string;
  @IsString()
  @MinLength(6)
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        "Mật khẩu phải có ít nhất 6 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
    }
  )
  password: string;
  @IsString()
  @MinLength(3, { message: "Tên phải dài hơn 3 ký tự" })
  name: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsOptional()
  @IsString()
  image?: string;
}
