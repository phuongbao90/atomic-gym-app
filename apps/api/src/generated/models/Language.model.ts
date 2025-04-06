import { IsString, IsDefined, IsBoolean, IsDate } from "class-validator";
import { Text, Translation } from "./";

export class Language {
    @IsDefined()
    @IsString()
    id!: string;

    @IsDefined()
    @IsString()
    name!: string;

    @IsDefined()
    @IsBoolean()
    isDefault!: boolean;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;

    @IsDefined()
    texts!: Text[];

    @IsDefined()
    Translation!: Translation[];
}
