import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDto } from '../dto/task.dto';
import { Task } from '../entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const task = this.taskRepository.create(createTaskDto);

      await this.taskRepository.save(task);

      return task;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        'Error al crear la tarea',
      );
    }
  }

  async findAll() {
    try {
      return await this.taskRepository.find();
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        'Error al obtener las tareas',
      );
    }
  }
}