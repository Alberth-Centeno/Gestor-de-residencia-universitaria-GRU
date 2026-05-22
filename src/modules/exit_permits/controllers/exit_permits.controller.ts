import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ExitPermitsService } from '../services/exit_permits.service';
import { CreateExitPermitDto, UpdateExitPermitDto } from '../dto/exit_permit.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Exit Permits') // Agrupa tus endpoints de pases en la documentación de Swagger
@Controller('exit-permits')
export class ExitPermitsController {
  constructor(private readonly exitPermitsService: ExitPermitsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pase de salida para un estudiante' })
  create(@Body() createExitPermitDto: CreateExitPermitDto) {
    return this.exitPermitsService.create(createExitPermitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pases de salida con sus relaciones' })
  findAll() {
    return this.exitPermitsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pase de salida específico por su ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exitPermitsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar el estado o datos de un pase de salida' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateExitPermitDto: UpdateExitPermitDto
  ) {
    return this.exitPermitsService.update(id, updateExitPermitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar física o lógicamente un pase de salida' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.exitPermitsService.remove(id);
  }
}