import { Module } from '@nestjs/common';
import { StudentsModule } from './modules/students/students.module';
import { TasksModule } from './modules/tasks/tasks.module';


@Module({
  imports: [StudentsModule, TasksModule]
  
})
export class AppModule {}
