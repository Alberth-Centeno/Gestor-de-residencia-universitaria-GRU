import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('students')
export class StudentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  student_code: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  career: string;

  @Column({ nullable: true })
  room_number: string;

  @Column({ default: 'Active' })
  scholarship_status: string;

  // Relación Uno a Uno con User
  @OneToOne(() => UserEntity, (user) => user.id, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Esto crea la clave foránea user_id en la tabla students
  user: UserEntity;
}