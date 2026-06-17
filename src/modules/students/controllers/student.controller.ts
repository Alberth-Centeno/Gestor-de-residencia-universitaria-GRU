import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpStatus, HttpCode, Put, Delete, UseGuards } from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { CreateStudentDto } from '../dto/student.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../users/entities/user.entity';
import { ApiOperation } from '@nestjs/swagger';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR) // Solo los usuarios con rol 'admin' pueden crear estudiantes
  @UseGuards(JwtAuthGuard, RolesGuard) // Protege este endpoint con autenticación y autorización
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo estudiante' })
  async create(@Body() createStudentDto: CreateStudentDto) {
   
    return await this.studentService.create(createStudentDto);
  }
  
  @Get()
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR) // Solo los usuarios con rol 'admin' pueden obtener estudiantes
  @UseGuards(JwtAuthGuard, RolesGuard) // Protege este endpoint con autenticación y autorización
  @ApiOperation({ summary: 'Obtener todos los estudiantes' })
  async findAll() {
    return await this.studentService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR) // Solo los usuarios con rol 'admin' pueden obtener estudiantes
  @UseGuards(JwtAuthGuard, RolesGuard) // Protege este endpoint con autenticación y autorización
  @ApiOperation({ summary: 'Obtener un estudiante por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.studentService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR) // Solo los usuarios con rol 'admin' pueden actualizar estudiantes
  @UseGuards(JwtAuthGuard, RolesGuard) // Protege este endpoint con autenticación y autorización
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un estudiante por ID' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateData: Partial<CreateStudentDto>) {
    return await this.studentService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR) // Solo los usuarios con rol 'admin' pueden eliminar estudiantes
  @UseGuards(JwtAuthGuard, RolesGuard) // Protege este endpoint con autenticación y autorización
  @ApiOperation({ summary: 'Eliminar un estudiante por ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.studentService.delete(id);
  }
}
