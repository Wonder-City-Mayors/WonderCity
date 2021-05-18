import { Transform, Type } from "class-transformer"
import {
    IsDateString,
    IsDefined,
    IsInt,
    IsNumberString,
    Max,
    Min,
} from "class-validator"

export class getReadoutsDto {
    @IsDefined()
    @IsDateString()
    begin: string

    @IsDateString()
    end?: string

    @Max(100)
    @Min(1)
    @IsInt()
    @Transform((a) => Number(a.value))
    @IsDefined()
    parts: number

    @Transform((a) => Number(a.value))
    @IsInt()
    @IsDefined()
    deviceId: number
}
