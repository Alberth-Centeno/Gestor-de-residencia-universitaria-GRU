import { Module } from "@nestjs/common";
import { FeedbackController} from "./controllers/feedback.controller";
import { FeedbackService } from "./services/feedback.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from "./entities/feedback.entity";



@Module({
    imports: [TypeOrmModule.forFeature([Feedback])],
    controllers: [FeedbackController],
    providers: [FeedbackService],
    exports: []
})
export class FeedbackModule {}