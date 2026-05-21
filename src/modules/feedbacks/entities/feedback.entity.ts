import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn } from "typeorm";

@Entity('feedbacks')

export class Feedback {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'int4'})
  student_id!: number;

  @Column({type:'varchar',length: 50})//estados,advertencias,etc sobre el estudiante
  type!: string;

  @Column({type:'text'})//esto es para opinion sobre el estudianta
  content!: string;

  @Column({ default: false })//se utilizara para saber si el estudiante ha leido la indicacion
  is_read!: boolean;

  @CreateDateColumn() //fecha  en que se crea el feed
  created_at!: Date;
}