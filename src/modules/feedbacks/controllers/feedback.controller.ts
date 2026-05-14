import {Controller,Get,Post,Body,Param,Put,Delete} from '@nestjs/common';

import { FeedbackService } from '../service/feedback.service';
import {CreateFeedbackDto,UpdateFeedbackDto} from '../dto/feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
  ) {}

  @Post()
  create(
    @Body() createFeedbackDto: CreateFeedbackDto,
  ) {
    return this.feedbackService.create(
      createFeedbackDto,
    );
  }

  @Get()
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(+id);
  }

  @Put(':id')
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
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(+id);
  }
}