import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsEntity } from '../entities/notifications.entity';
import { UserService } from '../../users/services/user.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationsEntity)
    private readonly notificationRepository: Repository<NotificationsEntity>,
    
    private readonly userService: UserService,
  ) {}

 async create(userId: number, message: string): Promise<NotificationsEntity> {
    const user = await this.userService.findById(userId);
    if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado para notificar.`);
    }

    const newNotification = this.notificationRepository.create({
      user_id: userId, 
      message: message, 
      is_read: false,
    });

    return await this.notificationRepository.save(newNotification);
  }
  
  async findByUserId(userId: number): Promise<NotificationsEntity[]> {
    return await this.notificationRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      withDeleted: true
    });
  }

  
  async findUnreadByUserId(userId: number): Promise<NotificationsEntity[]> {
     return await this.notificationRepository.find({
        where: { user_id: userId, is_read: false },
        order: { created_at: 'DESC' },
          withDeleted: true
     });
  }

 
  async markAsRead(notificationId: number): Promise<NotificationsEntity> {
    const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
    
    if (!notification) {
      throw new NotFoundException(`Notificación con ID ${notificationId} no encontrada.`);
    }

    notification.is_read = true;
    return await this.notificationRepository.save(notification);
  }

  
  async markAllAsReadForUser(userId: number): Promise<void> {
      await this.notificationRepository.update(
          { user_id: userId, is_read: false }, 
          { is_read: true }                   
      );
  }
}