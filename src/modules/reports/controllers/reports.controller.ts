import { Controller, Get, Query, HttpStatus, HttpCode, BadRequestException } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { QueryExitPermitsReportDto, QueryTasksReportDto } from '../dto/report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // Endpoint: GET /reports/exit-permits?userId=2&userName=Lennys&status=Returned_Late
  @Get('exit-permits')
  @HttpCode(HttpStatus.OK)
  async getExitPermitsReport(
    @Query() query: QueryExitPermitsReportDto,
    @Query('userId') userId: string,
    @Query('userName') userName: string,
  ) {
    if (!userId || !userName) {
      throw new BadRequestException('Para auditoría en Postman, debes proveer userId y userName en los query params');
    }

    return await this.reportsService.generateExitPermitsReport(query, Number(userId), userName);
  }

  // Endpoint: GET /reports/tasks?userId=3&userName=Alberth&taskType=Kitchen
  @Get('tasks')
  @HttpCode(HttpStatus.OK)
  async getTasksReport(
    @Query() query: QueryTasksReportDto,
    @Query('userId') userId: string,
    @Query('userName') userName: string,
  ) {
    if (!userId || !userName) {
      throw new BadRequestException('Para auditoría en Postman, debes proveer userId y userName en los query params');
    }

    return await this.reportsService.generateTasksReport(query, Number(userId), userName);
  }
}