import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { CreateTaskDto } from '../dto/task.dto';
import { TaskService } from '../services/task.service';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
  ) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }
}