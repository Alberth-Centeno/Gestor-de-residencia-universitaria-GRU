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

    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

   if (!password) {
      throw new Error('La contraseña es obligatoria');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      role: role || UserRole.STUDENT,
    });

    return await this.userRepository.save(newUser);
  }

 
  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email }, withDeleted: true });
  }

 
  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id:id, }, withDeleted: true });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

 
   async findAll(): Promise<UserEntity[]> {
        return this.userRepository.find({
            withDeleted: true,      
            order: { created_at: 'DESC' },
        });
      }
 
  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.softRemove(user);
  }
}