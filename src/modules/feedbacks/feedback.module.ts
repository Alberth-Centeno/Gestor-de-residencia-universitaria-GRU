import { Module } from "@nestjs/common";
import { FeedbackModule } from "./controllers/feedback.controller";



@Module({
    controllers: [FeedbackModule],
    providers: [FeedbackModule]
})
export class TasksModule {}