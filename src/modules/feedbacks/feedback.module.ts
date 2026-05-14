import { Module } from "@nestjs/common";
import { FeedbackController } from "./controllers/feedback.controller";
import { FeedbackService } from './service/feedback.service';
import { Feedback } from './entities/feedback.entity';
import { TypeOrmModule } from "@nestjs/typeorm";



@Module({
    imports:[TypeOrmModule.forFeature([Feedback])],
    controllers: [FeedbackController],
    providers: [FeedbackService]
})
export class FeedbackModule {}