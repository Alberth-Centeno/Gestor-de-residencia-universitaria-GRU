import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,ManyToOne,JoinColumn } from "typeorm";
import { StudentEntity } from "../../students/entities/student.entity";
@Entity('feedbacks')

export class Feedback {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => StudentEntity, student => student.feedbacks)
  @JoinColumn({ name: 'student_id' })
  student!: StudentEntity

  @Column({type:'varchar',length: 50})//estados,advertencias,etc sobre el estudiante
  type!: string;

  @Column({type:'text'})//esto es para opinion sobre el estudianta
  content!: string;

  @Column({ default: false })//se utilizara para saber si el estudiante ha leido la indicacion
  is_read!: boolean;

  @CreateDateColumn() //fecha  en que se crea el feed
  created_at!: Date;
}