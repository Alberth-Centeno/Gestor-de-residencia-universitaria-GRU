import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  // --- Datos para la cuenta de Usuario ---
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty()
  role?: UserRole = UserRole.STUDENT; 


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