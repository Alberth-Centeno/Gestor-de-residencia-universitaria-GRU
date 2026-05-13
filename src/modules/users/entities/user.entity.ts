import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";


@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('increment', {type:'int4'})
    id: number;

    @Column({type: 'varchar', length: 255})
    email: string;

    @Column({type: 'varchar', length: 255})
    password: string;

    @Column({type: 'varchar', length: 255})
    role: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    deleted_at: Date;
}