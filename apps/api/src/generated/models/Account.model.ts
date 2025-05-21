import { IsString, IsDefined, IsOptional, IsDate } from "class-validator";
import { User } from "./";

export class Account {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsString()
    accountId!: string;

    @IsDefined()
    @IsString()
    providerId!: string;

    @IsDefined()
    @IsString()
    userId!: string;

    @IsDefined()
    user!: User;

    @IsOptional()
    @IsString()
    accessToken?: string;

    @IsOptional()
    @IsString()
    refreshToken?: string;

    @IsOptional()
    @IsString()
    idToken?: string;

    @IsOptional()
    @IsDate()
    accessTokenExpiresAt?: Date;

    @IsOptional()
    @IsDate()
    refreshTokenExpiresAt?: Date;

    @IsOptional()
    @IsString()
    scope?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;
}
