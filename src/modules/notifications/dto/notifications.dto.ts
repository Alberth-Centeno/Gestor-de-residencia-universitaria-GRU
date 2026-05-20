import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDto {
    @ApiProperty()
    @IsNotEmpty()
    user_id: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    message: string;

    @ApiProperty({ default: false })
    is_read?: boolean;
}

export class UpdateNotificationDto extends PartialType (CreateNotificationDto) {}  

