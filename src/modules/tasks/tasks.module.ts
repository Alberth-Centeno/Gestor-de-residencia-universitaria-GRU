import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';
import { Task } from './entities/task.entity';
// 1. Importa el módulo donde vive el StudentService
import { StudentsModule } from '../students/students.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]), // Ya no necesitas StudentEntity aquí, lo maneja el StudentsModule
    StudentsModule, // 2. ¡Esta es la pieza que faltaba!
  ], 
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TasksModule {}