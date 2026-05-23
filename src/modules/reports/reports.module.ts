import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from './entities/reports.entity';
import { ExitPermitsModule } from '../exit_permits/exit_permits.module'; 
import { TasksModule } from '../tasks/tasks.module';
import { StudentsModule } from '../students/students.module';
@Module({
  imports:[TypeOrmModule.forFeature([ReportEntity]),
  ExitPermitsModule, 
  TasksModule,
  StudentsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [TypeOrmModule, ReportsService],
})
export class ReportsModule {}
