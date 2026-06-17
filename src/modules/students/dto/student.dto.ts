import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { shifType } from '../entities/student.entity';

export class CreateStudentDto {
  @IsInt()
  @ApiProperty()
  @IsNotEmpty({
    message:
      'El ID del usuario es obligatorio para vincular el perfil del estudiante.',
  })
  user_id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  student_code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  career: string;

  @IsEnum(shifType)
  @ApiProperty({
    enum: shifType,
    example: shifType.MORNING,
    description: 'Turno asignado al estudiante',
  })
  @IsNotEmpty()
  shift: shifType;

  @IsString()
  @IsOptional()
  room_number?: string;

  @IsString()
  @IsOptional()
  scholarship_status?: string = 'Active';
}

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}