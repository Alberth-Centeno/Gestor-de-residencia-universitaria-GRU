import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportEntity } from '../entities/reports.entity';
import { QueryExitPermitsReportDto, QueryTasksReportDto } from '../dto/report.dto';
import { ExitPermitsService } from '../../exit_permits/services/exit_permits.service';
import { TaskService } from '../../tasks/services/task.service';
import { StudentService } from '../../students/services/student.service'; 

import PDFDocument from 'pdfkit';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    private readonly exitPermitsService: ExitPermitsService,
    private readonly tasksService: TaskService,
    
    // 2. Inyectamos el servicio de estudiantes para buscar los nombres reales por ID
    private readonly studentsService: StudentService, 
  ) {}

  // 1. REPORTE DINÁMICO DE PASES DE SALIDA
  async generateExitPermitsReport(query: QueryExitPermitsReportDto, userId: number, userName: string): Promise<PDFKit.PDFDocument> {
    await this.reportRepository.save({
      report_type: 'EXIT_PERMITS',
      generated_by_name: userName,
      parameters: JSON.stringify(query),
      user: { id: userId } as any,
    });

    const allPermits = await this.exitPermitsService.findAll();
    
    const permits = allPermits.filter(permit => {
      const matchStatus = query.status ? permit.status === query.status : true;
      return matchStatus;
    });

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    this.generateHeader(doc, 'REPORTE DE HISTORIAL DE PASES DE SALIDA', userName);

    let startY = 190;

    // Encabezados limpios con "Estudiante" en vez de ID
    doc.fontSize(10).fillColor('#1a365d');
    doc.text('Estudiante', 50, startY);
    doc.text('Motivo / Razón', 200, startY);
    doc.text('Estado', 380, startY);
    doc.text('Fecha Salida', 460, startY);

    doc.moveTo(50, startY + 14).lineTo(545, startY + 14).strokeColor('#cbd5e1').lineWidth(1).stroke();
    startY += 25;

    if (permits && permits.length > 0) {
      // Usamos for...of para poder usar await dentro del bucle de forma segura
      for (const permit of permits) {
        if (startY > 780) { doc.addPage(); startY = 50; }

        doc.fontSize(9).fillColor('#333333');
        
        //  BUSQUEDA DINÁMICA DEL NOMBRE DEL ESTUDIANTE
        let studentName = 'No registrado';
        try {
          // Asumiendo que su método se llama findOne(id) o findById(id)
          const student = await this.studentsService.findOne(permit.student_id);
          // Cambia 'name' por la propiedad real que use su entidad (ej: first_name, nombre, etc.)
          studentName = student ? `${student.first_name}` : `ID: ${permit.student_id}`;
        } catch (error) {
          studentName = `ID: ${permit.student_id}`; // Fallback por si falla la consulta
        }

        const reasonText = permit.reason || 'Sin motivo especificado';
        const status = permit.status || 'Pending';
        
        const displayDate = permit.actual_departure 
          ? new Date(permit.actual_departure).toLocaleDateString() 
          : new Date(permit.requested_departure).toLocaleDateString();

        doc.text(studentName, 50, startY, { width: 140, ellipsis: true });
        doc.text(reasonText, 200, startY, { width: 170, ellipsis: true });

        const statusColor = status === 'Returned_Late' ? '#b91c1c' : '#1e40af';
        doc.fillColor(statusColor).text(status, 380, startY);
        
        doc.fillColor('#333333').text(displayDate, 460, startY);

        doc.moveTo(50, startY + 12).lineTo(545, startY + 12).strokeColor('#f1f5f9').lineWidth(0.5).stroke();
        startY += 22;
      }
    } else {
      doc.fontSize(10).fillColor('#64748b').text('No se encontraron pases de salida registrados.', 50, startY, { align: 'center' });
    }

    return doc;
  }

  // 2. REPORTE DINÁMICO DE TAREAS SEMANALES
  async generateTasksReport(query: QueryTasksReportDto, userId: number, userName: string): Promise<PDFKit.PDFDocument> {
    await this.reportRepository.save({
      report_type: 'TASKS',
      generated_by_name: userName,
      parameters: JSON.stringify(query),
      user: { id: userId } as any,
    });

    const allTasks = await this.tasksService.findAll();

    const tasks = allTasks.filter(task => {
      const matchStatus = query.status ? task.status === query.status : true;
      const matchType = query.taskType ? task.task_type === query.taskType : true;
      return matchStatus && matchType;
    });

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    this.generateHeader(doc, 'REPORTE DE ROLES SEMANALES DE DEBERES', userName);

    let startY = 190;

    // Encabezados limpios con "Estudiante"
    doc.fontSize(10).fillColor('#1a365d');
    doc.text('Estudiante', 50, startY);
    doc.text('Área / Tipo de Tarea', 220, startY);
    doc.text('Fecha Programada', 360, startY);
    doc.text('Estado', 470, startY);

    doc.moveTo(50, startY + 14).lineTo(545, startY + 14).strokeColor('#cbd5e1').lineWidth(1).stroke();
    startY += 25;

    if (tasks && tasks.length > 0) {
      // Usamos for...of para resolver la promesa del nombre del estudiante en cada iteración
      for (const task of tasks) {
        if (startY > 780) { doc.addPage(); startY = 50; }

        doc.fontSize(9).fillColor('#333333');

        // BUSQUEDA DINÁMICA DEL NOMBRE DEL ESTUDIANTE
        let studentName = 'Sin Asignar';
        try {
          const student = await this.studentsService.findOne(task.student_id);
          studentName = student ? `${student.first_name}` : `ID: ${task.student_id}`;
        } catch (error) {
          studentName = `ID: ${task.student_id}`;
        }

        const typeText = task.task_type || 'Kitchen';
        const taskDate = task.scheduled_date ? new Date(task.scheduled_date).toLocaleDateString() : 'S/F';
        const status = task.status || 'Pending';

        doc.text(studentName, 50, startY, { width: 160, ellipsis: true });
        doc.text(typeText, 220, startY, { width: 130, ellipsis: true });
        doc.text(taskDate, 360, startY, { width: 100 });

        const statusColor = status.toLowerCase() === 'completed' ? '#16a34a' : '#d97706';
        doc.fillColor(statusColor).text(status, 470, startY);

        doc.moveTo(50, startY + 12).lineTo(545, startY + 12).strokeColor('#f1f5f9').lineWidth(0.5).stroke();
        startY += 22;
      }
    } else {
      doc.fontSize(10).fillColor('#64748b').text('No se encontraron roles de tareas asignadas.', 50, startY, { align: 'center' });
    }

    return doc;
  }

  // ENCABEZADO INSTITUCIONAL URACCAN
  private generateHeader(doc: PDFKit.PDFDocument, title: string, userName: string) {
    const pageWidth = 595;

    doc.fillColor('#0000bd').rect(pageWidth - 28, 0, 6, 842).fill();
    doc.fillColor('#facc15').rect(pageWidth - 22, 0, 6, 842).fill();
    doc.fillColor('#16a34a').rect(pageWidth - 16, 0, 6, 842).fill();

    try {
      doc.image('public/img/logo_de_uraccan.png', 50, 40, { width: 65 });
    } catch (error) {
      doc.fontSize(8).fillColor('#ef4444').text('[Escudo no encontrado]', 50, 65);
    }

    doc.fillColor('#1a365d')
       .fontSize(13)
       .text('UNIVERSIDAD DE LAS REGIONES AUTÓNOMAS DE', 130, 42, { width: 380, align: 'left' })
       .text('LA COSTA CARIBE NICARAGUENSE', { width: 380, align: 'left' })
       .fontSize(15)
       .text('URACCAN', { width: 380, align: 'left' })
       .fontSize(10)
       .fillColor('#475569')
       .text('Gestor de Residencia Universitaria (GRU) - CUR Nueva Guinea', { width: 380, align: 'left' });

    doc.moveTo(50, 115).lineTo(pageWidth - 45, 115).strokeColor('#cbd5e1').lineWidth(1).stroke();

    doc.moveDown(1);
    doc.fillColor('#64748b')
       .fontSize(9)
       .text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, { align: 'right' })
       .text(`Generado por: ${userName}`, { align: 'right' });

    doc.moveDown(1.5);
    doc.fillColor('#0f172a')
       .fontSize(14)
       .text(title, { align: 'center' });
  }
}