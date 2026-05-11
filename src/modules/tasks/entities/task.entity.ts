import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('tasks') // crea la tabla 'tasks' en la base de datos
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; // Limpieza de Cocina

  @Column({ type: 'text', nullable: true })
  description: string; // Detalles de la tarea

  @Column({ default: 'pending' })
  status: string; // pending, in-progress, completed

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date; // Fecha límite para cumplirla

  @CreateDateColumn()
  createdAt: Date; // la Fecha en que se creó el registro
}