import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDTO {
    @IsEmail()
    @IsNotEmpty()
    @MinLength(5)
    @ApiProperty({example: 'esteesuncorreo@example.com'})
    email: string;

    @MinLength(6)
    @IsNotEmpty()
    @ApiProperty({example: 'b31d032cfdcf47a399990a71e43c5d2a:144816a'})
    password: string;

    @IsNotEmpty()
    @ApiProperty({example: 'admin'})
    role: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}