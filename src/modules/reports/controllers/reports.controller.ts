import { Controller, Get, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { QueryExitPermitsReportDto, QueryTasksReportDto } from '../dto/report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('exit-permits')
  @HttpCode(HttpStatus.OK)
  async getExitPermitsReport(@Query() query: QueryExitPermitsReportDto) {
    // Extraemos userId y userName directo del objeto validado por el DTO
    const { userId, userName } = query;
    return await this.reportsService.generateExitPermitsReport(query, Number(userId), userName);
  }

  @Get('tasks')
  @HttpCode(HttpStatus.OK)
  async getTasksReport(@Query() query: QueryTasksReportDto) {
    const { userId, userName } = query;
    return await this.reportsService.generateTasksReport(query, Number(userId), userName);
  }
}