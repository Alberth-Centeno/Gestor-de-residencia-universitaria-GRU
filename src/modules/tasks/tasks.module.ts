import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';
import { Task } from './entities/task.entity';
import { StudentEntity } from '../students/entities/student.entity'; 

@Module({
 
  imports: [TypeOrmModule.forFeature([Task, StudentEntity])], 
  controllers: [TaskController],
  providers: [TaskService],
})
export class TasksModule {}