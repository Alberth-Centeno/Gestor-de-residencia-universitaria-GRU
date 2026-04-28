import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('estudiantes')
export class Estudiante {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int4' })
  usuario_id!: number;

  @Column({ type: 'varchar', length: 80 })
  nombre_completo!: string;

  @Column({ type: 'varchar', length: 13 })
  cedula!: string;

  @Column({ type: 'varchar', length: 50 })
  codigo_unico!: string;

  @Column({ type: 'varchar', length: 50 })
  carrera!: string;

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
}
