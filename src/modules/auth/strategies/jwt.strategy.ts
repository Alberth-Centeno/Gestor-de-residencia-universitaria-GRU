import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // <-- 1. Importamos ConfigService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) { // <-- 2. Lo inyectamos en el constructor
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET must be defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 3. Leemos la clave directamente de tu archivo .env (asegurada como string)
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    // Retornamos el rol que viene empaquetado en el token
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}