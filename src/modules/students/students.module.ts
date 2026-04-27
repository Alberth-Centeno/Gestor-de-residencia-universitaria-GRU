import { Module } from '@nestjs/common';
import { StudentService } from './services/student.service';
import { StudentController } from './controllers/student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([StudentService])],
  exports: [TypeOrmModule, StudentService],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentsModule {}
