import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { StudentEntity } from '../../students/entities/student.entity';
// import { User } from '../users/entities/user.entity';

@Entity('exit_permits')
export class ExitPermit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  student_id!: number;

  @ManyToOne(() => StudentEntity)
  @JoinColumn({ name: 'student_id' })
  student!: StudentEntity;

  @Column({ type: 'text' })
  reason!: string;

  @Column({ type: 'timestamp' })
  requested_departure!: Date;

  @Column({ type: 'timestamp' })
  requested_return!: Date;

  @Column({type: 'varchar',default: 'Pending',comment: 'Pending, Approved, Rejected, Departed, Returned_OnTime, Returned_Late'})
  status!: string;

  @Column({ nullable: true })
  approved_by!: number;

  @Column({ type: 'timestamp', nullable: true })
  approval_date!: Date;

  @Column({ nullable: true, comment: 'Guarda que registró la salida' })
  guard_departure_id!: number;

  @Column({ type: 'timestamp', nullable: true })
  actual_departure!: Date;

  @Column({ nullable: true, comment: 'Guarda que registró el retorno' })
  guard_return_id!: number;

  @Column({ type: 'timestamp', nullable: true })
  actual_return!: Date;

  @Column({ type: 'text', nullable: true, comment: 'Observaciones del guarda' })
  guard_observations!: string;
}
