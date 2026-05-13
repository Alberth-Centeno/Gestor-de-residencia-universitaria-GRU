import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./service/user.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserService])],
    controllers: [UserController],
    providers: [UserService],
    exports: [TypeOrmModule, UserService]
})
export class UserModule {}