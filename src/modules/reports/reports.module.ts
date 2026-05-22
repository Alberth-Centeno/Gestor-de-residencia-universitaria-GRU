import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from './entities/reports.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ReportEntity]),],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [TypeOrmModule, ReportsService],
})
export class ReportsModule {}
