import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  ParseIntPipe, 
  HttpStatus, 
  HttpCode, 
  Patch, 
  Delete 
} from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { CreateStudentDto, UpdateStudentDto } from '../dto/student.dto'; // <-- Agregado UpdateStudentDto

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentService.create(createStudentDto);
  }

  @Get()
  async findAll() {
    return await this.studentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.studentService.findOne(id);
  }

  // === NUEVO: Endpoint para editar un estudiante por ID ===
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return await this.studentService.update(id, updateStudentDto);
  }

  // === NUEVO: Endpoint para eliminar un estudiante por ID ===
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Devuelve un 204 No Content (estándar para eliminaciones exitosas sin cuerpo)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.studentService.remove(id);
  }
}
