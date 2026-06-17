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
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    const morningStudents =
      await this.studentService.getStudentsByShift(
        shifType.MORNING,
      );

    const afternoonStudents =
      await this.studentService.getStudentsByShift(
        shifType.AFTERNOON,
      );

    if (
      morningStudents.length === 0 &&
      afternoonStudents.length === 0
    ) {
      throw new NotFoundException(
        'No existen estudiantes registrados para asignar tareas',
      );
    }

    const assignedTasks: Task[] = [];

    let morningIndex = 0;
    let afternoonIndex = 0;

    const baseDate = new Date(targetDate);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + i);

      const dayName = daysOfWeek[i];

      /**
       * 4 ESTUDIANTES MATUTINOS
       */
      for (let j = 0; j < 4; j++) {
        if (morningStudents.length > 0) {
          const morningStudent =
            morningStudents[
              morningIndex % morningStudents.length
            ];

          const morningTask =
            await this.taskRepository.save(
              this.taskRepository.create({
                student_id: morningStudent.id,
                task_type: 'Kitchen',
                description:
                  'Apoyo en cocina - turno matutino',
                scheduled_date: currentDate,
                day_of_week: dayName,
                shift: 'Morning',
                start_time: '08:00:00',
                end_time: '09:00:00',
                status: 'Pending',
              }),
            );

          assignedTasks.push(morningTask);

          morningIndex++;
        }
      }

      /**
       * 4 ESTUDIANTES VESPERTINOS
       */
      for (let j = 0; j < 4; j++) {
        if (afternoonStudents.length > 0) {
          const afternoonStudent =
            afternoonStudents[
              afternoonIndex % afternoonStudents.length
            ];

          const afternoonTask =
            await this.taskRepository.save(
              this.taskRepository.create({
                student_id: afternoonStudent.id,
                task_type: 'Kitchen',
                description:
                  'Apoyo en cocina - turno vespertino',
                scheduled_date: currentDate,
                day_of_week: dayName,
                shift: 'Afternoon',
                start_time: '14:00:00',
                end_time: '15:00:00',
                status: 'Pending',
              }),
            );

          assignedTasks.push(afternoonTask);

          afternoonIndex++;
        }
      }
    }

    return {
      message:
        'Asignación semanal generada exitosamente',
      tasks_created: assignedTasks.length,
      details: assignedTasks,
    };
  } catch (error) {
    console.error(error);

    if (error instanceof NotFoundException) {
      throw error;
    }

    throw new InternalServerErrorException(
      'Error interno al generar asignaciones',
    );
  }
}
}