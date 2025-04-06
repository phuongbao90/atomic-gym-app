import { IsInt, IsDefined, IsString, IsDate } from "class-validator";
import { Text, Language } from "./";

export class Translation {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    text!: Text;

    @IsDefined()
    @IsInt()
    textId!: number;

    @IsDefined()
    language!: Language;

    @IsDefined()
    @IsString()
    languageId!: string;

    @IsDefined()
    @IsString()
    content!: string;

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;
}
