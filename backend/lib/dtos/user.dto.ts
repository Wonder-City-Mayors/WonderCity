import { IsNotEmpty, IsString } from "class-validator"

export class getMeDto {
    @IsString()
    @IsNotEmpty()
    jwt: string
}
