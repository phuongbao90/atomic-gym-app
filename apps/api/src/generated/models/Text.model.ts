import { IsInt, IsDefined, IsString, IsDate } from "class-validator";
import { Language, Translation } from "./";

export class Text {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    key!: string;

    @IsDefined()
    @IsString()
    originalText!: string;

    @IsDefined()
    language!: Language;

    @IsDefined()
    @IsString()
    languageId!: string;

    @IsDefined()
    translations!: Translation[];

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;
}
