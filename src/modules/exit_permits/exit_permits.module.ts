import { Module, forwardRef } from '@nestjs/common';
import { ExitPermitsService } from './services/exit_permits.service';
import { ExitPermitsController } from './controllers/exit_permits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExitPermit } from './entities/exit_permits.entity';
import { StudentsModule } from '../students/students.module'; 
@Module({
  imports: [
    TypeOrmModule.forFeature([ExitPermit]),
    forwardRef(() => StudentsModule), // <-- Solución al error: Envolvemos el módulo con forwardRef
  ],
  exports: [
    TypeOrmModule, 
    ExitPermitsService
  ],
  providers: [
    ExitPermitsService
  ],
  controllers: [
    ExitPermitsController
  ],
})
export class ExitPermitsModule {}