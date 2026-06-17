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

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_id: number;

  @ManyToOne(() => StudentEntity, (student) => student.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: StudentEntity;

  @Column({
    type: 'varchar',
    default: 'Kitchen',
  })
  task_type: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'date',
  })
  scheduled_date: Date;

  /**
   * Nuevo campo para almacenar
   * el día de la semana:
   * Monday, Tuesday, Wednesday...
   */
  @Column({
    type: 'varchar',
    nullable: true,
  })
  day_of_week: string;

  /**
   * Nuevo campo para almacenar
   * el turno asignado.
   *
   * Morning
   * Afternoon
   */
  @Column({
    type: 'varchar',
    nullable: true,
  })
  shift: string;

  @Column({
    type: 'time',
    nullable: true,
  })
  start_time: string;

  @Column({
    type: 'time',
    nullable: true,
  })
  end_time: string;

  @Column({
    type: 'varchar',
    default: 'Pending',
  })
  status: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  completed_at: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  verified_at: Date;

  @Column({
    nullable: true,
  })
  verified_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}