import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsEntity } from '../entities/notifications.entity';
import { UserService } from '../../users/services/user.service';
import { CreateNotificationDto } from '../dto/notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationsEntity)
    private readonly notificationRepository: Repository<NotificationsEntity>,
    
    private readonly userService: UserService,
  ) {}

 
  async create(createNotificationDto: CreateNotificationDto): Promise<NotificationsEntity> {
    const { user_id, message } = createNotificationDto;

    // Verificar que el usuario exista antes de crear la notificación
    const user = await this.userService.findOne(user_id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${user_id} no encontrado para notificar.`);
    }

    const newNotification = this.notificationRepository.create({
      user_id, 
      message, 
      is_read: false,
    });

    return await this.notificationRepository.save(newNotification);
  }

  async findAll(): Promise<NotificationsEntity[]> {
    return await this.notificationRepository.find({ order: { created_at: 'DESC' } });
  }

  async findOne(id: number): Promise<NotificationsEntity> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada.`);
    }
    return notification;
  }
  async findByUserId(userId: number): Promise<NotificationsEntity[]> {
    return await this.notificationRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      //withDeleted: true
    });
  }
  
  async markAsRead(id: number): Promise<NotificationsEntity> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada.`);
    }
    notification.is_read = true;
    return await this.notificationRepository.save(notification);
  }
  
  async update (id: number, updateNotificationDto: Partial<CreateNotificationDto>): Promise<NotificationsEntity> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada.`);
    }

    Object.assign(notification, updateNotificationDto);
    return await this.notificationRepository.save(notification);
  }

  async delete(id: number): Promise<void> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada.`);
    }
    await this.notificationRepository.remove(notification);
  }
}