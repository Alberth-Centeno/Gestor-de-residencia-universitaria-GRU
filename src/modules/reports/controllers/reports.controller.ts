import { Controller, Get, Query, HttpStatus, HttpCode, Res } from '@nestjs/common';
import * as express from 'express'; 
import { ReportsService } from '../services/reports.service';
import { QueryExitPermitsReportDto, QueryTasksReportDto } from '../dto/report.dto';


@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('exit-permits')
  @HttpCode(HttpStatus.OK)
  async getExitPermitsReport(
    @Query() query: QueryExitPermitsReportDto,
    @Res() res: express.Response // Inyectamos la respuesta nativa para manejar streams
  ) {
    const { userId, userName } = query;
    
    // Generamos el documento PDFKit desde el servicio
    const pdfDoc = await this.reportsService.generateExitPermitsReport(query, Number(userId), userName);

    // Configuramos las cabeceras HTTP para descarga de PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte-pases-${Date.now()}.pdf`);

    // Entubamos (pipe) el documento de PDFKit directamente hacia la respuesta HTTP
    pdfDoc.pipe(res);
    pdfDoc.end();
  }

  @Get('tasks')
  @HttpCode(HttpStatus.OK)
  async getTasksReport(
    @Query() query: QueryTasksReportDto,
    @Res() res: express.Response
  ) {
    const { userId, userName } = query;
    
    const pdfDoc = await this.reportsService.generateTasksReport(query, Number(userId), userName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte-tareas-${Date.now()}.pdf`);

    pdfDoc.pipe(res);
    pdfDoc.end();
  }
}