import {
  Injectable,
  InternalServerErrorException,
  NotFoundException, 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDto } from '../dto/task.dto';
import { Task } from '../entities/task.entity';
import { StudentEntity } from '../../students/entities/student.entity'; 

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      
      const student = await this.studentRepository.findOne({
        where: { id: createTaskDto.student_id },
      });

      
      if (!student) {
        throw new NotFoundException(`El estudiante con ID ${createTaskDto.student_id} no se encuentra registrado.`);
      }

      
      const task = this.taskRepository.create(createTaskDto);
      await this.taskRepository.save(task);

      return task;
    } catch (error) {
      console.log(error);
      
      if (error instanceof NotFoundException) throw error;
      
      throw new InternalServerErrorException('Error al crear la tarea');
    }
  }

  async findAll() {
    try {
      
      return await this.taskRepository.find({
        relations: ['student'], 
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al obtener las tareas');
    }
  }

  
  async update(id: number, updateTaskDto: any) { 
    try {
      const task = await this.taskRepository.preload({
        id: id,
        ...updateTaskDto,
      });

      if (!task) {
        throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
      }

      return await this.taskRepository.save(task);
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al actualizar la tarea');
    }
  }

  
  async remove(id: number) {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });

      if (!task) {
        throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
      }

      await this.taskRepository.remove(task);
      return { message: `Tarea #${id} eliminada correctamente` };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar la tarea');
    }
  }
}