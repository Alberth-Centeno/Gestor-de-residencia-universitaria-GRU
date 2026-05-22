import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity'; 

@Entity('reports')
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  report_type: string; // Ej: 'EXIT_PERMITS', 'TASKS', 'FEEDBACK'

  @Column({ type: 'varchar', length: 100 })
  generated_by_name: string; // Nombre de quien lo generó para auditoría rápida

  @Column({ type: 'text', nullable: true })
  parameters: string; // Filtros usados guardados en JSON (Ej: '{"startDate": "2026-01-01"}')

  @CreateDateColumn({ type: 'timestamp' })
  generated_at: Date;

  // Relación: Muchos reportes pueden ser generados por un mismo Usuario (Admin/Superior)
  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}