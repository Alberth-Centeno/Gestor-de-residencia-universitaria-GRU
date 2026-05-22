import { IsOptional, IsDateString, IsEnum, IsString, IsNotEmpty } from 'class-validator';

// 1. DTO para filtrar el Historial de Permisos de Salida
export class QueryExitPermitsReportDto {
  @IsNotEmpty({ message: 'El userId de auditoría es requerido' })
  @IsString()
  userId: string;

  @IsNotEmpty({ message: 'El userName de auditoría es requerido' })
  @IsString()
  userName: string;

  @IsOptional()
  @IsDateString({}, { message: 'startDate debe ser una fecha válida (YYYY-MM-DD)' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'endDate debe ser una fecha válida (YYYY-MM-DD)' })
  endDate?: string;

  @IsOptional()
  @IsEnum(['Pending', 'Approved', 'Rejected', 'Departed', 'Returned_OnTime', 'Returned_Late'], {
    message: 'El estado del permiso no es válido según el esquema del sistema',
  })
  status?: string;

  @IsOptional()
  @IsString()
  career?: string;
}

// 2. DTO para filtrar los Roles Semanales de Deberes (Cocina/Limpieza)
export class QueryTasksReportDto {
  @IsNotEmpty({ message: 'El userId de auditoría es requerido' })
  @IsString()
  userId: string;

  @IsNotEmpty({ message: 'El userName de auditoría es requerido' })
  @IsString()
  userName: string;

  @IsOptional()
  @IsDateString({}, { message: 'date debe ser una fecha válida (YYYY-MM-DD)' })
  scheduledDate?: string;

  @IsOptional()
  @IsEnum(['Kitchen', 'Cleaning'], { message: 'El tipo de tarea debe ser Kitchen o Cleaning' })
  taskType?: string;

  @IsOptional()
  @IsEnum(['Pending', 'DoneByStudent', 'VerifiedByInspector'], {
    message: 'El estado de la tarea no es válido',
  })
  status?: string;
}