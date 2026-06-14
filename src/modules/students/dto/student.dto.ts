import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateStudentDto {
  @IsInt()
  @ApiProperty()
  @IsNotEmpty({message: 'El ID del usuario es obligatorio para vincular el perfil del estudiante.'})
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

  @IsString()
  @IsOptional()
  room_number?: string; 

  @IsString()
  @IsOptional()
  scholarship_status?: string = 'Active'; 
}

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}