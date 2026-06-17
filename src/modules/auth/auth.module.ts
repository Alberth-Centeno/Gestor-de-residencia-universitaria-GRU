import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../users/user.module'; // Importamos tu UserModule para buscar al usuario
import { ConfigModule, ConfigService } from '@nestjs/config'; // Para cargar variables de entorno
import { JwtStrategy } from './strategies/jwt.strategy'; // Importamos la estrategia JWT  
@Module({
  imports: [
    UserModule, // Necesario para que AuthService use UserService
    PassportModule,
    ConfigModule.forRoot(), // Carga el archivo .env
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'), // <-- ¡Ahora viene del .env!
            signOptions: { expiresIn: '8h' },
  }),
})
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Agregamos la estrategia JWT a los providers
  exports: [AuthService, JwtModule], // Exportamos para que los Guards puedan usarlo luego
})
export class AuthModule {}