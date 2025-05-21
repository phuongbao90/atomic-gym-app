import { IsString, IsDefined, IsDate, IsOptional } from "class-validator";
import "./";

export class Verification {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsString()
    identifier!: string;

    @IsDefined()
    @IsString()
    value!: string;

    @IsDefined()
    @IsDate()
    expiresAt!: Date;

    @IsOptional()
    @IsDate()
    createdAt?: Date;

    @IsOptional()
    @IsDate()
    updatedAt?: Date;
}
