import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ExitPermitsService } from '../services/exit_permits.service';
import { CreateExitPermitDto } from '../dto/exit_permit.dto';

@Controller('exit-permits')
export class ExitPermitsController {
  constructor(private readonly exitPermitsService: ExitPermitsService) {}

  @Post()
  create(@Body() createExitPermitDto: CreateExitPermitDto) {
    return this.exitPermitsService.create(createExitPermitDto);
  }

  @Get()
  findAll() {
    return this.exitPermitsService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExitPermitDto: Partial<CreateExitPermitDto>, // Partial permite recibir solo los campos que cambien
  ) {
    return this.exitPermitsService.update(id, updateExitPermitDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.exitPermitsService.remove(id);
  }
}