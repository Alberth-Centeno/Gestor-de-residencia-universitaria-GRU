import { Module } from '@nestjs/common';
import { ExitPermitsService } from './services/exit_permits.service';
import { ExitPermitsController } from './controllers/exit_permits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([ExitPermitsService])],
  exports: [TypeOrmModule, ExitPermitsService],
  providers: [ExitPermitsService],
  controllers: [ExitPermitsController],
})
export class ExitPermitsModule {}
