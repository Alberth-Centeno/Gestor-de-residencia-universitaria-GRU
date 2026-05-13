import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTaskDto } from '../dto/task.dto';

@Controller('task')
export class TaskController {

  @Get()
  findAll() {
    return 'Lista de tareas';
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return createTaskDto;
  }

}