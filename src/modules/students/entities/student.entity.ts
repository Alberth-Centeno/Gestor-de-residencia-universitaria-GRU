import { ExitPermit } from '../../exit_permits/entities/exit_permits.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('estudiantes')
export class Estudiante {
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

  @Column({ type: 'varchar', length: 50 })
  cuarto_asignado!: string;

  @Column({ type: 'varchar', length: 50 })
  estado_beca!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at!: Date;

  @OneToMany(() => ExitPermit, (exitPermit) => exitPermit.student)
  exitPermits!: ExitPermit[];
}