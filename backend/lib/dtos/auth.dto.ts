import {
    IsNumber,
    IsString,
    MaxLength,
    MinLength,
    ValidateIf,
} from "class-validator"

export class createUserDto {
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @ValidateIf((username) => !/[^0-9a-zA-Z#$*_]/.test(username))
    username: string

    @IsString()
    @MinLength(8)
    password: string
}

export class signStationDto {
    @IsNumber()
    id: number

    @IsString()
    @MinLength(8)
    password: string
}
