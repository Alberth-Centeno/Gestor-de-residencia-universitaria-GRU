import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

// DTO utilizado para registrar una nueva tarea.
// Aquí se definen los datos que el sistema espera recibir
// cuando se realiza una petición POST para crear una tarea.
export class CreateTaskDto {

  // Identificador del estudiante al que se le asignará la tarea.
  // Debe coincidir con un estudiante existente en la base de datos.
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'Identificador del estudiante asignado a la tarea',
  })
  student_id: number;

  // Tipo o categoría de la tarea.
  // Ejemplos: limpieza, cocina, lavandería, mantenimiento, etc.
  @IsString()
  @ApiProperty({
    example: 'Kitchen',
    description: 'Tipo de tarea asignada',
  })
  task_type: string;

  // Información adicional que describe la tarea.
  // Este campo es opcional porque algunas tareas pueden
  // identificarse únicamente con su tipo.
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Limpieza del pasillo',
    required: false,
    description: 'Descripción detallada de la tarea',
  })
  description?: string;

  // Fecha programada para realizar la tarea.
  // Debe enviarse en formato YYYY-MM-DD.
  @IsDateString()
  @ApiProperty({
    example: '2026-05-13',
    description: 'Fecha programada para ejecutar la tarea',
  })
  scheduled_date: Date;

  // Hora de inicio programada para la tarea.
  // Se valida que el formato sea HH:MM o HH:MM:SS.
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

  // Hora estimada de finalización.
  // También se valida para evitar formatos incorrectos.
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

  // Estado actual de la tarea.
  // Normalmente se crea como "Pending", pero puede cambiar
  // posteriormente a otros estados según la lógica del sistema.
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Pending',
    required: false,
    description: 'Estado actual de la tarea',
  })
  status?: string;
}

// DTO utilizado para actualizar tareas existentes.
// Hereda todos los campos de CreateTaskDto pero los convierte
// en opcionales, permitiendo modificar únicamente los datos necesarios.
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}