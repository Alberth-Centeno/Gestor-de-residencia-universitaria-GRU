import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, HttpStatus, HttpCode, Delete, Put } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { CreateNotificationDto } from '../dto/notifications.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('notifications') 
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


  @Post()
  @ApiOperation({ summary: 'Crear una nueva notificación para un usuario' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() CreateNotificationDto: CreateNotificationDto)  {
    return await this.notificationsService.create(CreateNotificationDto);
  }


  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener todas las notificaciones de un usuario específico' })
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.notificationsService.findByUserId(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las notificaciones' })
  async findAll() {
    return await this.notificationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.notificationsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una notificación por ID' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateNotificationDto: Partial<CreateNotificationDto>) {
    return await this.notificationsService.update(id, updateNotificationDto);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    return await this.notificationsService.markAsRead(id);
  }
  
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una notificación por ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.notificationsService.delete(id);
  }
  
}