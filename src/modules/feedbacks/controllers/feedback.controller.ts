import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';

import { FeedbackService } from '../services/feedback.service';
import {CreateFeedbackDto,UpdateFeedbackDto,} from '../dto/feedback.dto';
import{JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('feedback')
export class FeedbackController {

  constructor(
    private readonly feedbackService: FeedbackService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.INSPECTOR,
    UserRole.SUPERIOR,
    UserRole.GUARD
  )
  create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Request() req,
  ) {
    return this.feedbackService.create(
      createFeedbackDto,
      req.user.userId,
    );
  }

  @Get()
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.feedbackService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.update(
      +id,
      updateFeedbackDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.feedbackService.remove(+id);
  }
}