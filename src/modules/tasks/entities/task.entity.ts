import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_id: number;

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