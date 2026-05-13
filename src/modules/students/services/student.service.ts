// src/modules/students/services/student.service.ts
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEntity } from '../entities/student.entity';
import { UserService } from '../../users/services/user.service';
import { UserRole } from '../../users/entities/user.entity';
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    

    private readonly userService: UserService,
  ) {}

  
  async create(createStudentData: any) {
    const { email, password, ...studentDetails } = createStudentData;


    const user = await this.userService.create({
      email,
      password,
      role: UserRole.STUDENT,
    });

    try {
      const newStudent = this.studentRepository.create({
        ...studentDetails,
        user: user, // TypeORM extraerá el ID automáticamente para la FK
      });

      return await this.studentRepository.save(newStudent);
      
    } catch (error) {
      if (error instanceof Object && 'code' in error && error.code === '23505') {
        throw new ConflictException('El carnet estudiantil ya existe');
      }
      throw new InternalServerErrorException('Error al crear el perfil del estudiante');
    }
  }

  
  async findAll(): Promise<StudentEntity[]> {
    return await this.studentRepository.find({
      relations: ['user'], // Esto hace el 'JOIN' para traer el correo y rol
    });
  }

  
  async findOne(id: number): Promise<StudentEntity | null> {
    return await this.studentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}