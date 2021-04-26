import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsString,
    Min,
    MinLength,
    ValidateIf,
} from "class-validator"

export class jwtDto {
    @IsString()
    @IsNotEmpty()
    jwt: string
}

export class deviceIdDto {
    @IsInt()
    @Min(1)
    id: number
}

export class nameDto {
    @IsString()
    @IsNotEmpty()
    @ValidateIf((name) => !/[^А-яёЁ]/.test(name))
    name: string
}

export class lastNameDto {
    @IsString()
    @IsNotEmpty()
    @ValidateIf((lastName) => !/[^А-яёЁ]/.test(lastName))
    lastName: string
}

export class emailDto {
    @IsString()
    @IsEmail()
    email: string
}

export class passwordDto {
    @IsString()
    @MinLength(8)
    password: string
}
