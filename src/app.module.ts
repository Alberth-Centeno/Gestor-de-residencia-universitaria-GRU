import { Module } from '@nestjs/common';
import { StudentsModule } from './modules/students/students.module';
import { ExitPermitsController } from './modules/exit_permits/controllers/exit_permits.controller';
import { ExitPermitsService } from './modules/exit_permits/services/exit_permits.service';

@Module({
  imports: [StudentsModule],
  controllers: [ExitPermitsController],
  providers: [ExitPermitsService],
})
export class AppModule {}
