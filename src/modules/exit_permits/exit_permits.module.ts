import { Module } from '@nestjs/common';
import { ExitPermitsService } from './services/exit_permits.service';
import { ExitPermitsController } from './controllers/exit_permits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExitPermit } from './entities/exit_permits.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ExitPermit])],
  exports: [ ExitPermitsService],
  providers: [ExitPermitsService],
  controllers: [ExitPermitsController],
})
export class ExitPermitsModule {}
