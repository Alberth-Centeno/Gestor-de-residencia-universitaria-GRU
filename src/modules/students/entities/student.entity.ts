import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany,ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { ExitPermit } from '../../exit_permits/entities/exit_permits.entity';
import { Task } from '../../tasks/entities/task.entity'; 
import { Feedback } from '../../feedbacks/entities/feedback.entity';

export enum shifType {
  MORNING = 'matutino',
  AFTERNOON = 'vespertino',
  EVENING = 'nocturno',
}
@Entity('students')
export class StudentEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  id: number;

  @Column({ type: 'int4' })
  user_id: number;

  @Column({ unique: true })
  student_code: string;

  @Column('varchar', { length: 255 })
  first_name: string;

  @Column('varchar', { length: 255 })
  last_name: string;

  @Column('varchar', { length: 255 })
  career: string;

  @Column({ type: 'enum', enum: shifType, default: shifType.MORNING })
  shift: shifType;

  @Column('varchar', { length: 255, nullable: true })
  room_number: string;

  @Column('varchar', { length: 255, default: 'Active' })
  scholarship_status: string;

  @OneToOne(() => UserEntity, (user) => user.id, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ExitPermit, (exitPermit) => exitPermit.student)
  exitPermits: ExitPermit[];

  @OneToMany(() => Task, (task) => task.student)
  tasks: Task[];

  @OneToMany(() => Feedback, feedback => feedback.student)
  feedbacks!: Feedback[];

}