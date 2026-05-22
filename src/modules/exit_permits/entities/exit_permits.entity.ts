import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { StudentEntity } from '../../students/entities/student.entity';
import { UserEntity } from '../../users/entities/user.entity'; // <-- Revisa que esta ruta apunte bien a la entidad de usuarios

@Entity('exit_permits')
export class ExitPermit {

  @PrimaryGeneratedColumn()
  id!: number;

  // RELACIÓN CON EL ESTUDIANTE
  @Column()
  student_id!: number;

  @ManyToOne(() => StudentEntity, (student) => student.exitPermits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student!: StudentEntity;

  // DATOS BÁSICOS DEL PERMISO
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

  // RELACIÓN CON EL INSPECTOR (Aprobación)
  @Column({ nullable: true })
  approved_by!: number;

  // ESTA ES LA RELACIÓN Conecta la columna 'approved_by' con la entidad UserEntity
  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approved_by' })
  inspector!: UserEntity;

  @Column({ type: 'timestamp', nullable: true })
  approval_date!: Date;

  // RELACIÓN CON EL GUARDA DE SALIDA
  @Column({ nullable: true })
  guard_departure_id!: number;

  // ESTA ES LA RELACIÓN QUE Conecta la columna 'guard_departure_id' con UserEntity
  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'guard_departure_id' })
  guard_departure!: UserEntity;

  @Column({ type: 'timestamp', nullable: true })
  actual_departure!: Date;

  // RELACIÓN CON EL GUARDA DE RETORNO
  @Column({ nullable: true })
  guard_return_id!: number;

  // ESTA ES LA RELACIÓN QUE Conecta la columna 'guard_return_id' con UserEntity
  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'guard_return_id' })
  guard_return!: UserEntity;

  @Column({ type: 'timestamp', nullable: true })
  actual_return!: Date;

  // OBSERVACIONES FINALES
  @Column({ type: 'text', nullable: true })
  guard_observations!: string;
}