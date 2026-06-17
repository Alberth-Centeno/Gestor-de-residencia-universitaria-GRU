import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateTaskDto {
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'Identificador del estudiante asignado a la tarea',
  })
  student_id: number;

  @IsString()
  @ApiProperty({
    example: 'Kitchen',
    description: 'Tipo de tarea asignada',
  })
  task_type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Limpieza del pasillo',
    required: false,
    description: 'Descripción detallada de la tarea',
  })
  description?: string;

  @IsDateString()
  @ApiProperty({
    example: '2026-05-13',
    description: 'Fecha programada para ejecutar la tarea',
  })
  scheduled_date: Date;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message:
      'start_time debe tener un formato válido (HH:MM o HH:MM:SS)',
  })
  @ApiProperty({
    example: '08:00:00',
    required: false,
    description: 'Hora de inicio de la tarea',
  })
  start_time?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message:
      'end_time debe tener un formato válido (HH:MM o HH:MM:SS)',
  })
  @ApiProperty({
    example: '09:00:00',
    required: false,
    description: 'Hora de finalización de la tarea',
  })
  end_time?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Pending',
    required: false,
    description: 'Estado actual de la tarea',
  })
  status?: string;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsInt()
  verified_by?: number;
}