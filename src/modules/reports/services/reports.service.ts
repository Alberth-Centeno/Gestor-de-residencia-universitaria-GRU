import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportEntity } from '../entities/reports.entity';
import { QueryExitPermitsReportDto, QueryTasksReportDto } from '../dto/report.dto';
import { ExitPermitsService } from '../../exit_permits/services/exit_permits.service';
import { TaskService } from '../../tasks/services/task.service';
import PDFDocument from 'pdfkit';
@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    private readonly exitPermitsService: ExitPermitsService,
    private readonly tasksService: TaskService,
  ) {}

  // 1. Generar Reporte de Pases de Salida
  async generateExitPermitsReport(query: QueryExitPermitsReportDto, userId: number, userName: string): Promise<PDFKit.PDFDocument> {
    // A. Guardamos la auditoría en la base de datos
    await this.reportRepository.save({
      report_type: 'EXIT_PERMITS',
      generated_by_name: userName,
      parameters: JSON.stringify(query),
      user: { id: userId } as any,
    });
    // B. Inicializamos el documento PDFKit
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // C. Dibujamos el encabezado institucional de URACCAN
    this.generateHeader(doc, 'REPORTE DE HISTORIAL DE PASES DE SALIDA', userName);

    // D. Dibujamos la estructura tabular (Maqueta inicial con texto simulado)
    doc.moveDown(2);
    doc.fontSize(14).fillColor('#1a365d').text('Listado de Estudiantes con Pases Registrados', { underline: true });
    doc.moveDown(1);

    // Simulamos filas de tabla por ahora usando texto simple alineado
    doc.fontSize(10).fillColor('#333333');
    doc.text(`Filtros aplicados en Postman: Estado -> ${query.status || 'Todos'} | Carrera -> ${query.career || 'Todas'}`);
    doc.moveDown(1.5);
    
    // Aquí pintaremos el bucle (forEach) con la data real de la base de datos en el siguiente paso
    doc.text('Estudiante: Juan Pérez | Carrera: Sistemas | Estado: Retornado Tarde');
    doc.moveDown(0.5);
    doc.text('Estudiante: María López | Carrera: Sistemas | Estado: Retornado Tarde');
    
    // E. Retornamos el documento listo para ser transmitido
    return doc;
  }

  // 2. Generar Reporte de Tareas Semanales (Cocina/Limpieza)
  async generateTasksReport(query: QueryTasksReportDto, userId: number, userName: string): Promise<PDFKit.PDFDocument> {
    await this.reportRepository.save({
      report_type: 'TASKS',
      generated_by_name: userName,
      parameters: JSON.stringify(query),
      user: { id: userId } as any,
    });

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    this.generateHeader(doc, 'REPORTE DE ROLES SEMANALES DE DEBERES', userName);

    doc.moveDown(2);
    doc.fontSize(14).fillColor('#1a365d').text('Asignación de Tareas de Cocina y Limpieza', { underline: true });
    doc.moveDown(1);

    doc.fontSize(10).fillColor('#333333');
    doc.text(`Filtros aplicados en Postman: Tipo de Tarea -> ${query.taskType || 'Todas'} | Estado -> ${query.status || 'Todos'}`);
    doc.moveDown(1.5);

    doc.text('Estudiante: Alberth Centeno | Tarea: Cocina | Estado: Pendiente');
    doc.moveDown(0.5);
    doc.text('Estudiante: Lennys Mercado | Tarea: Limpieza | Estado: Completado');

    return doc;
  }

  // Método Privado para diseñar el Membrete Institucional (Evita duplicar diseño)
  private generateHeader(doc: PDFKit.PDFDocument, title: string, userName: string) {
    // Título Principal de la Universidad
    doc.fillColor('#1a365d')
       .fontSize(18)
       .text('URACCAN', { align: 'center' })
       .fontSize(12)
       .text('Centro Universitario Regional - Nueva Guinea', { align: 'center' })
       .text('Gestor de Residencia Universitaria (GRU)', { align: 'center' });

    // Línea divisoria elegante
    doc.moveTo(50, 115).lineTo(545, 115).strokeColor('#cbd5e1').lineWidth(1).stroke();

    // Bloque de metadatos de auditoría (Alineado a la derecha)
    doc.moveDown(1.5);
    doc.fillColor('#64748b')
       .fontSize(9)
       .text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, { align: 'right' })
       .text(`Generado por: ${userName}`, { align: 'right' });

    // Título del reporte específico
    doc.moveDown(1);
    doc.fillColor('#0f172a')
       .fontSize(14)
       .text(title, { align: 'center', underline: false });
  }
}