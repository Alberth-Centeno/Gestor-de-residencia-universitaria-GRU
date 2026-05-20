import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

@Entity('notifications')
export class NotificationsEntity {
    @PrimaryGeneratedColumn('increment', { type: 'int4' })
    id: number;

    @Column('int4')
    user_id: number;

    @Column('varchar', { length: 255 })
    message: string;

    @Column({ default: false })
    is_read: boolean;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
    user: UserEntity;
}