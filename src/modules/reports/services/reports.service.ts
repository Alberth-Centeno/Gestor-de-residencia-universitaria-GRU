import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportEntity } from '../entities/reports.entity';
import { QueryExitPermitsReportDto, QueryTasksReportDto } from '../dto/report.dto';
import { ExitPermitsService } from '../../exit_permits/services/exit_permits.service';
import { TaskService } from '../../tasks/services/task.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    private readonly exitPermitsService: ExitPermitsService,
    private readonly tasksService: TaskService,
  ) {}

  // 1. Procesar la data del reporte de Pases de Salida
  async generateExitPermitsReport(query: QueryExitPermitsReportDto, userId: number, userName: string) {
    // Aquí mandaremos a llamar los métodos de consulta de pases en las siguientes ramas
    
    // Guardamos la auditoría en el historial
    await this.reportRepository.save({
      report_type: 'EXIT_PERMITS',
      generated_by_name: userName,
      parameters: JSON.stringify(query),
      user: { id: userId } as any,
    });

    return { message: 'Data de pases obtenida y auditoría registrada con éxito' };
  }

  // 2. Procesar la data del reporte semanal de Deberes (Cocina/Limpieza)
  async generateTasksReport(query: QueryTasksReportDto, userId: number, userName: string) {
    // Aquí mandaremos a llamar los métodos de consulta de tareas en las siguientes ramas

    // Guardamos la auditoría en el historial
    await this.reportRepository.save({
      report_type: 'TASKS',
      generated_by_name: userName,
      parameters: JSON.stringify(query),
      user: { id: userId } as any,
    });

    return { message: 'Data de tareas obtenida y auditoría registrada con éxito' };
  }
}