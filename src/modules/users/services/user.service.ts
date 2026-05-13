import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  
  async create(userData: Partial<UserEntity> & { password?: string }): Promise<UserEntity> {
    const { email, password, role } = userData;

    // 1. Verificar si el usuario ya existe
    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

   if (!password) {
      throw new Error('La contraseña es obligatoria');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Crear la instancia con la clave encriptada
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      role: role || UserRole.STUDENT,
    });

    // 4. Guardar en DB
    return await this.userRepository.save(newUser);
  }

  /**
   * Busca un usuario por email. 
   * Útil para el proceso de Login y validaciones.
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  /**
   * Busca un usuario por ID para perfiles o auditoría.
   */
  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  /**
   * Lista todos los usuarios (solo para roles Admin o Superior).
   */
  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  /**
   * Borrado lógico (Soft Delete) gracias a @DeleteDateColumn
   */
  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.softRemove(user);
  }
}