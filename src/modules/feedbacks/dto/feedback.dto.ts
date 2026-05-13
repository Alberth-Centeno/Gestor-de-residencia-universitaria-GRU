import { ApiProperty, PartialType } from '@nestjs/swagger';
import {IsInt,IsNotEmpty,IsNumber,IsOptional,IsPositive,IsString,MinLength,IsBoolean} from 'class-validator'

export class CreateFeedbackDto {

    @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  student_id!: number; 

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  content!: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  is_read!: boolean;

}
export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {}