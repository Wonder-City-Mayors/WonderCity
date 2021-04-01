import { IsEmail, IsString, MinLength, ValidateIf } from "class-validator";

export class createUserDto {
    @IsString()
    @ValidateIf((username) => !/[^0-9a-zA-Z#$*_]/.test(username))
    username: string;

    @IsString()
    @MinLength(8)
    password: string;
}
