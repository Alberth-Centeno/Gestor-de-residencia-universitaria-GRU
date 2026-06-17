import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDto } from '../dto/task.dto';
import { Task } from '../entities/task.entity';
import { StudentEntity, shifType } from '../../students/entities/student.entity';
import { StudentService } from '../../students/services/student.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,

    private readonly studentService: StudentService,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const student = await this.studentRepository.findOne({
        where: { id: createTaskDto.student_id },
      });

      if (!student) {
        throw new NotFoundException(
          `El estudiante con ID ${createTaskDto.student_id} no existe.`,
        );
      }

      const task = this.taskRepository.create(createTaskDto);

      return await this.taskRepository.save(task);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Error al intentar crear la tarea',
      );
    }
  }

  async findAll() {
    try {
      return await this.taskRepository.find({
        relations: ['student'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al consultar las tareas',
      );
    }
  }

  async findOne(id: number) {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['student'],
      });

      if (!task) {
        throw new NotFoundException(
          `Tarea con ID ${id} no encontrada`,
        );
      }

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Error al consultar la tarea',
      );
    }
  }

  async update(id: number, updateTaskDto: any) {
  try {
    /**
     * Evitar que el usuario manipule manualmente
     * las fechas automáticas.
     */
    delete updateTaskDto.completed_at;
    delete updateTaskDto.verified_at;

    const task = await this.taskRepository.preload({
      id,
      ...updateTaskDto,
    });

    if (!task) {
      throw new NotFoundException(
        `Tarea con ID ${id} no encontrada`,
      );
    }

    /**
     * Cuando el estudiante marca la tarea
     * como completada, registrar automáticamente
     * la fecha y hora real.
     */
    if (
      updateTaskDto.status === 'Completed' &&
      !task.completed_at
    ) {
      task.completed_at = new Date();
    }

    /**
     * Cuando un supervisor verifica la tarea,
     * registrar automáticamente la fecha
     * de verificación.
     */
    if (
      updateTaskDto.status === 'Verified' &&
      !task.verified_at
    ) {
      task.verified_at = new Date();
    }

    return await this.taskRepository.save(task);

  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }

    throw new InternalServerErrorException(
      'Error al actualizar la tarea',
    );
  }
}

  async remove(id: number) {
    try {
      const task = await this.findOne(id);

      await this.taskRepository.remove(task);

      return {
        message: `Tarea #${id} eliminada con éxito`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Error al eliminar la tarea',
      );
    }
  }

  async autoAssignTasks(targetDate: string) {
    try {
      const morningTasks = [
        {
          task_type: 'Kitchen',
          start_time: '08:00:00',
          end_time: '09:00:00',
          description: 'Preparar desayuno y limpiar',
        },
        {
          task_type: 'Bathrooms',
          start_time: '10:00:00',
          end_time: '11:00:00',
          description: 'Limpieza profunda de duchas',
        },
      ];

      const afternoonTasks = [
        {
          task_type: 'Hallways',
          start_time: '14:00:00',
          end_time: '15:00:00',
          description: 'Barrer y trapear pasillos',
        },
      ];

      const afternoonStudents =
        await this.studentService.getStudentsByShift(
          shifType.AFTERNOON,
        );

      const morningStudents =
        await this.studentService.getStudentsByShift(
          shifType.MORNING,
        );

      const assignedTasks: Task[] = [];

      const afternoonPool = [...afternoonStudents];
      const morningPool = [...morningStudents];

      for (const requirement of morningTasks) {
        const chosenStudent = afternoonPool.shift();

        if (!chosenStudent) {
          continue;
        }

        const task = await this.taskRepository.save(
          this.taskRepository.create({
            student_id: chosenStudent.id,
            task_type: requirement.task_type,
            description: requirement.description,
            scheduled_date: new Date(targetDate),
            start_time: requirement.start_time,
            end_time: requirement.end_time,
            status: 'Pending',
          }),
        );

        assignedTasks.push(task);
      }

      for (const requirement of afternoonTasks) {
        const chosenStudent = morningPool.shift();

        if (!chosenStudent) {
          continue;
        }

        const task = await this.taskRepository.save(
          this.taskRepository.create({
            student_id: chosenStudent.id,
            task_type: requirement.task_type,
            description: requirement.description,
            scheduled_date: new Date(targetDate),
            start_time: requirement.start_time,
            end_time: requirement.end_time,
            status: 'Pending',
          }),
        );

        assignedTasks.push(task);
      }

      return {
        message: 'Asignación automática generada exitosamente',
        tasks_created: assignedTasks.length,
        details: assignedTasks,
      };
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(
        'Error interno al generar asignaciones',
      );
    }
  }
}