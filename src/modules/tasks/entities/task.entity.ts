import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentEntity } from '../../students/entities/student.entity';

@Entity('tasks') // Tabla tasks en PostgreSQL
export class Task {

  @PrimaryGeneratedColumn()
  id: number; // Identificador único generado automáticamente

  @Column()
  student_id: number; // Estudiante al que se asigna la tarea

  @ManyToOne(() => StudentEntity, (student) => student.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: StudentEntity; // Relación con la entidad Student

  @Column({
    type: 'varchar',
    default: 'Kitchen',
  })
  task_type: string; // Tipo o categoría de la tarea

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description: string; // Descripción detallada de la tarea

  @Column({
    type: 'date',
  })
  scheduled_date: Date; // Fecha programada para realizar la tarea

  @Column({
    type: 'time',
    nullable: true,
  })
  start_time: string; // Hora de inicio programada (HH:MM:SS)

  @Column({
    type: 'time',
    nullable: true,
  })
  end_time: string; // Hora estimada de finalización (HH:MM:SS)

  @Column({
    type: 'varchar',
    default: 'Pending',
  })
  status: string; // Estado actual de la tarea

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  completed_at: Date; // Fecha y hora en que la tarea fue completada

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  verified_at: Date; // Fecha y hora en que la tarea fue verificada

  @Column({
    nullable: true,
  })
  verified_by: number; // Usuario que verificó la tarea

  @CreateDateColumn()
  created_at: Date; // Fecha de creación del registro

  @UpdateDateColumn()

  updated_at: Date; // Fecha de la última actualización
}


