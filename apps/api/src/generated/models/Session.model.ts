import { IsString, IsDefined, IsDate, IsOptional } from "class-validator";
import { User } from "./";

export class Session {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsDate()
    expiresAt!: Date;

    @IsDefined()
    @IsString()
    token!: string;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;

    @IsOptional()
    @IsString()
    ipAddress?: string;

    @IsOptional()
    @IsString()
    userAgent?: string;

    @IsDefined()
    @IsString()
    userId!: string;

    @IsDefined()
    user!: User;
}
