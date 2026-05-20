import {ApiProperty } from '@nestjs/swagger'
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    MinLength,
    IsDateString,
    IsOptional,
} from 'class-validator';

export class CreateExitPermitDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  student_id!: number;
  
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  reason!: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  requested_departure!: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  requested_return!: Date;

  @IsString()
  @IsOptional()
  @ApiProperty()
  status?: string;
  
  @IsInt()
  @IsPositive()
  @IsOptional()
  @ApiProperty()
  approved_by?: number;
  
  @IsDateString()
  @IsOptional()
  @ApiProperty()
  approval_date?: Date;
  
  @IsInt()
  @IsPositive()
  @IsOptional()
  @ApiProperty()
  guard_departure_id?: number;
  
  @IsDateString()
  @IsOptional()
  @ApiProperty()
  actual_departure?: Date;
  
  @IsInt()
  @IsPositive()
  @IsOptional()
  @ApiProperty()
  guard_return_id?: number;
  
  @IsDateString()
  @IsOptional()
  @ApiProperty()
  actual_return?: Date;
  
  @IsString()
  @IsOptional()
  @ApiProperty()
  guard_observations?: string;
}
