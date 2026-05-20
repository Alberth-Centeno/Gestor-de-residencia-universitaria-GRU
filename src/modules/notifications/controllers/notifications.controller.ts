import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';

@Controller('notifications') 
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: { userId: number; message: string }) {
    return await this.notificationsService.create(body.userId, body.message);
  }


  @Get('user/:userId')
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.notificationsService.findByUserId(userId);
  }

 
  @Get('user/:userId/unread')
  async findUnreadByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.notificationsService.findUnreadByUserId(userId);
  }


  @Patch(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    return await this.notificationsService.markAsRead(id);
  }


  @Patch('user/:userId/read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead(@Param('userId', ParseIntPipe) userId: number) {
    await this.notificationsService.markAllAsReadForUser(userId);
  }
}