import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../users/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto'; // DTO con email y password

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 1. Valida si el usuario existe y la contraseña coincide.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    
    if (user && (await bcrypt.compare(pass, user.password))) {
      // Si la contraseña es correcta, devolvemos el usuario sin la contraseña
      const { password, ...result } = user;
      return result;
    }
    
    return null; // Credenciales inválidas
  }

  /**
   * 2. Genera el Token JWT tras una validación exitosa.
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    // Payload: la información que viajará encriptada dentro del token
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }
}