import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, HttpStatus, HttpCode, Delete, Put } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { CreateNotificationDto } from '../dto/notifications.dto';

@Controller('notifications') 
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() CreateNotificationDto: CreateNotificationDto)  {
    return await this.notificationsService.create(CreateNotificationDto);
  }


  @Get('user/:userId')
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.notificationsService.findByUserId(userId);
  }

  @Get()
  async findAll() {
    return await this.notificationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.notificationsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateNotificationDto: Partial<CreateNotificationDto>) {
    return await this.notificationsService.update(id, updateNotificationDto);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    return await this.notificationsService.markAsRead(id);
  }
  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.notificationsService.delete(id);
  }
  
}