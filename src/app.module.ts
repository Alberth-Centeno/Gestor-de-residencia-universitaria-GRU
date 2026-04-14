import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudiantesControllersController } from './modules/estudiantes/controllers/estudiantes-controllers.controller';
import { EstudianteService } from './modules/estudiantes/services/estudiante.service';

@Module({
  imports: [],
  controllers: [AppController, EstudiantesControllersController],
  providers: [AppService, EstudianteService],
})
export class AppModule {}
