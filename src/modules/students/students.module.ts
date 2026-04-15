import { Module } from '@nestjs/common';
import { StudentService } from './services/student.service';
import { StudentController } from './controllers/student.controller';

@Module({
  providers: [StudentService],
  controllers: [StudentController]
})
export class StudentsModule {}
