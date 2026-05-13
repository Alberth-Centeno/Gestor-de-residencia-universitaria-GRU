import { Module } from "@nestjs/common";
import { FileController } from "./controllers/file.controller";
import { FileService } from "./service/files.service";



@Module({
    controllers: [FileController],
    providers: [FileService]
})
export class TasksModule {}