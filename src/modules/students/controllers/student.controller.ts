import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { CreateStudentDto } from '../dto/student.dto';

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
}