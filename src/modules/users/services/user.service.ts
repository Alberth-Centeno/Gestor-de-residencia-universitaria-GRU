import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../dto/user.dto';
import { UpdateUserDTO } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Ahora recibe estrictamente el DTO validado
   async create(createUserDto: CreateUserDTO): Promise<UserEntity> {
    try {
      const { email, password, role } = createUserDto;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = this.userRepository.create({
        email,
        password: hashedPassword,
        role: (role as UserRole) || UserRole.STUDENT,
      });

      return await this.userRepository.save(newUser);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException({
          statusCode: 409,
          message: 'El email ya existe en el sistema',
          error: 'Conflict',
        });
      }
      throw error;
    }
  }

  // Método auxiliar clave para que el AuthModule pueda validar credenciales
  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDTO): Promise<UserEntity> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }    

  // Aplicación estricta de Hard Delete
  async delete(id: number): Promise<void> {
  try {
    // Soft delete (solo marca deleted_at)
    const result = await this.userRepository.softDelete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`El usuario con el ID ${id} no fue encontrado`);
    }
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Error al eliminar el usuario');
  }
}
}