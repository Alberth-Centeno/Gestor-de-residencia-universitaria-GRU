import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dto/task.dto';

/**
 * Controlador encargado de recibir las peticiones HTTP
 * relacionadas con la gestión de tareas.
 *
 * Todas las rutas definidas aquí estarán bajo:
 * /api/v1/task
 */
@Controller('task')
export class TaskController {
  /**
   * Inyección del servicio encargado de la lógica de negocio.
   */
  constructor(private readonly taskService: TaskService) {}

  /**
   * Genera automáticamente las tareas para una fecha específica.
   *
   * Ruta:
   * POST /task/auto-assign
   *
   * Body:
   * {
   *   "targetDate": "2026-06-15"
   * }
   */
  @Post('auto-assign')
  autoAssignTasks(@Body('targetDate') targetDate: string) {
    return this.taskService.autoAssignTasks(targetDate);
  }

  /**
   * Crea una nueva tarea en el sistema.
   *
   * Ruta:
   * POST /task
   */
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  /**
   * Obtiene el listado completo de tareas registradas.
   *
   * Ruta:
   * GET /task
   */
  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  /**
   * Busca una tarea por su identificador.
   *
   * Ruta:
   * GET /task/:id
   *
   * Ejemplo:
   * GET /task/1
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  /**
   * Actualiza la información de una tarea existente.
   *
   * Ruta:
   * PATCH /task/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: any) {
    return this.taskService.update(+id, updateTaskDto);
  }

  /**
   * Elimina una tarea según su identificador.
   *
   * Ruta:
   * DELETE /task/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}