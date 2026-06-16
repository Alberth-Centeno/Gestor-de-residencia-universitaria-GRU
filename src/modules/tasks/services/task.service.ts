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
import { StudentService } from '../../students/services/student.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>, // Repositorio encargado de la entidad Task

    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>, // Permite consultar estudiantes registrados

    private readonly studentService: StudentService, // Servicio que administra la disponibilidad de estudiantes
  ) {}

  /**
   * Crea una nueva tarea verificando previamente
   * que el estudiante asignado exista en el sistema.
   */
  async create(createTaskDto: CreateTaskDto) {
    try {
      const student = await this.studentRepository.findOne({
        where: { id: createTaskDto.student_id }, // Buscar estudiante asociado
      });

      if (!student) {
        throw new NotFoundException(
          `El estudiante con ID ${createTaskDto.student_id} no existe.`,
        );
      }

      const task = this.taskRepository.create(createTaskDto); // Construir entidad Task

      return await this.taskRepository.save(task); // Guardar en base de datos
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Error al intentar crear la tarea',
      );
    }
  }

  /**
   * Obtiene todas las tareas registradas junto
   * con la información del estudiante relacionado.
   */
  async findAll() {
    try {
      return await this.taskRepository.find({
        relations: ['student'], // Cargar datos del estudiante asociado
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al consultar las tareas',
      );
    }
  }

  /**
   * Busca una tarea específica mediante su identificador.
   */
  async findOne(id: number) {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['student'], // Incluir información del estudiante
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

  /**
   * Actualiza una tarea existente utilizando preload,
   * lo que permite combinar los datos actuales con
   * los nuevos valores enviados en la petición.
   */
  /**
 * Actualiza una tarea existente utilizando preload,
 * lo que permite combinar los datos actuales con
 * los nuevos valores enviados en la petición.
 */
async update(id: number, updateTaskDto: any) {
  try {
    const task = await this.taskRepository.preload({
      id,
      ...updateTaskDto, // Aplicar únicamente los campos recibidos
    });

    if (!task) {
      throw new NotFoundException(
        `Tarea con ID ${id} no encontrada`,
      );
    }

    /**
     * Si la tarea cambia a estado Completed,
     * registrar automáticamente la fecha de finalización.
     *
     * Se ignora cualquier completed_at enviado por el usuario
     * para evitar manipulaciones o inconsistencias.
     */
    if (
      updateTaskDto.status === 'Completed' &&
      !task.completed_at
    ) {
      task.completed_at = new Date();
    }

    return await this.taskRepository.save(task);

  } catch (error) {
    if (error instanceof NotFoundException) throw error;

    throw new InternalServerErrorException(
      'Error al actualizar la tarea',
    );
  }
}

  /**
   * Elimina una tarea después de verificar
   * que el registro exista en la base de datos.
   */
  async remove(id: number) {
    try {
      const task = await this.findOne(id); // Reutiliza la validación existente

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

  /**
   * Genera tareas automáticamente para una fecha determinada.
   *
   * La validación de disponibilidad ya no se realiza en este módulo.
   * Esa responsabilidad fue delegada al módulo Students para mantener
   * una mejor separación de responsabilidades dentro del sistema.
   */
  async autoAssignTasks(targetDate: string) {
    try {
      const dailyTasksNeeded = [
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
        {
          task_type: 'Hallways',
          start_time: '14:00:00',
          end_time: '15:00:00',
          description: 'Barrer y trapear pasillos',
        },
      ];

      const availableStudents =
        await this.studentService.getAvailableStudents(
          new Date(targetDate), // Consultar estudiantes disponibles para la fecha indicada
        );

      if (availableStudents.length === 0) {
        throw new InternalServerErrorException(
          'No hay estudiantes disponibles para esta fecha',
        );
      }

      const assignedTasks: Task[] = []; // Almacena las tareas creadas
      const currentPool = [...availableStudents]; // Copia local para manipular la lista

      for (const requirement of dailyTasksNeeded) {
        const chosenStudent = currentPool.shift(); // Obtiene el primer estudiante disponible

        if (!chosenStudent) break; // Finaliza si ya no quedan estudiantes

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

        assignedTasks.push(task); // Registrar tarea creada para el resultado final
      }

      return {
        message: 'Asignación automática generada exitosamente',
        tasks_created: assignedTasks.length,
        details: assignedTasks,
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error;

      throw new InternalServerErrorException(
        'Error interno al generar asignaciones',
      );
    }
  }
}