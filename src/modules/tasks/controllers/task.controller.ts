import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch,   
  Param,   
  Delete 
} from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dto/task.dto';

@Controller('task') // 👈 CAMBIA ESTO (Quítale el 'api/v1/')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: any) { 
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}