import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {

  @IsInt()
  @ApiProperty({ example: 1 })
  student_id: number;

  @IsString()
  @ApiProperty({ example: 'Kitchen' })
  task_type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Limpieza del pasillo', required: false })
  description?: string;

  @IsDateString()
  @ApiProperty({ example: '2026-05-13' })
  scheduled_date: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Pending', required: false })
  status?: string;

}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}