import { Module } from '@nestjs/common';
import { StudentService } from './services/student.service';
import { StudentController } from './controllers/student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentEntity } from './entities/student.entity';

import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentEntity]),
    UserModule,
  ],

  exports: [
    TypeOrmModule,
    StudentService,
  ],

  providers: [StudentService],

  controllers: [StudentController],
})
export class StudentsModule {}