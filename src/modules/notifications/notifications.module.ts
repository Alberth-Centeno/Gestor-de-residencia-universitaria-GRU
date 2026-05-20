import { Module } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { NotificationsController } from './controllers/notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsEntity } from './entities/notifications.entity';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationsEntity]),
    UserModule
], 
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService], 
})
export class NotificationsModule {}
