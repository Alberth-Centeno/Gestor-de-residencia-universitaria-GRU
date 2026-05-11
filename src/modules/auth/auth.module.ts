import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";

@Module({
    imports: [TypeOrmModule.forFeature([])],
    exports: [TypeOrmModule, AuthService],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}