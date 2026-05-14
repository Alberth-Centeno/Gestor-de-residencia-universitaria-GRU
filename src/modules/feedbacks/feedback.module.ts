import { Module } from "@nestjs/common";
import { FeedbackController } from "./controllers/feedback.controller";
import { FeedbackService } from './service/feedback.service';



@Module({
    controllers: [FeedbackController],
    providers: [FeedbackService]
})
export class TasksModule {}