import { Module } from '@nestjs/common';
import { StudentService } from './services/student.service';
import { StudentController } from './controllers/student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './entities/student.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Estudiante])],
  exports: [TypeOrmModule, StudentService],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentsModule {}
