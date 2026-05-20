import { Entity,
        PrimaryGeneratedColumn,
        Column, CreateDateColumn, 
        UpdateDateColumn, 
        DeleteDateColumn, 
        OneToOne, 
        OneToMany}
         from "typeorm";
import { StudentEntity } from "../../students/entities/student.entity";
import { NotificationsEntity } from "../../notifications/entities/notifications.entity";

export enum UserRole {
    ADMIN = 'Admin',
    SUPERIOR = 'Superior',
    INSPECTOR = 'Inspector',
    GUARD = 'Guard',
    STUDENT = 'Student',
    }

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('increment', {type:'int4'})
    id: number;

    @Column({type: 'varchar', length: 255, unique: true})
    email: string;

    @Column({type: 'varchar', length: 255})
    password: string;

    @Column({type: 'varchar', default: UserRole.STUDENT})
    role: UserRole;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    deleted_at: Date;

    @OneToOne(() => StudentEntity, (student) => student.user)
    student: StudentEntity;

    @OneToMany(() => NotificationsEntity, (notification) => notification.user)
    notifications: NotificationsEntity[];
}