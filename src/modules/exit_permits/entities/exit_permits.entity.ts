import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Estudiante } from '../../students/entities/student.entity';

@Entity('exit_permits')
export class ExitPermit {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  student_id!: number;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.exitPermits)
  @JoinColumn({ name: 'student_id' })
  student!: Estudiante;

  @Column({ type: 'text' })
  reason!: string;

  @Column({ type: 'timestamp' })
  requested_departure!: Date;

  @Column({ type: 'timestamp' })
  requested_return!: Date;

  @Column({
    type: 'varchar',
    default: 'Pending',
  })
  status!: string;

  @Column({ nullable: true })
  approved_by!: number;

  @Column({ type: 'timestamp', nullable: true })
  approval_date!: Date;

  @Column({ nullable: true })
  guard_departure_id!: number;

  @Column({ type: 'timestamp', nullable: true })
  actual_departure!: Date;

  @Column({ nullable: true })
  guard_return_id!: number;

  @Column({ type: 'timestamp', nullable: true })
  actual_return!: Date;

  @Column({ type: 'text', nullable: true })
  guard_observations!: string;
}