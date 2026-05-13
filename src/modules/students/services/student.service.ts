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
    
    // Inyectamos el servicio de usuarios para crear las credenciales primero
    private readonly userService: UserService,
  ) {}

  /**
   * Crea un usuario y un perfil de estudiante vinculado
   */
  async create(createStudentData: any) {
    const { email, password, ...studentDetails } = createStudentData;

    // 1. Crear el usuario con el rol de STUDENT
    // Nota: El password se encriptará dentro del UserService.create
    const user = await this.userService.create({
      email,
      password,
      role: UserRole.STUDENT,
    });

    try {
      // 2. Crear la entidad estudiante vinculando el objeto 'user' completo
      const newStudent = this.studentRepository.create({
        ...studentDetails,
        user: user, // TypeORM extraerá el ID automáticamente para la FK
      });

      // 3. Guardar en la tabla 'students'
      return await this.studentRepository.save(newStudent);
      
    } catch (error) {
      // Si falla la creación del estudiante (ej: carnet duplicado), 
      // podrías implementar lógica para borrar el usuario creado (rollback manual)
      if (error instanceof Object && 'code' in error && error.code === '23505') {
        throw new ConflictException('El carnet estudiantil ya existe');
      }
      throw new InternalServerErrorException('Error al crear el perfil del estudiante');
    }
  }

  /**
   * Obtener todos los estudiantes con sus datos de usuario (Email)
   */
  async findAll(): Promise<StudentEntity[]> {
    return await this.studentRepository.find({
      relations: ['user'], // Esto hace el 'JOIN' para traer el correo y rol
    });
  }

  /**
   * Buscar un estudiante por ID incluyendo su cuenta de usuario
   */
  async findOne(id: number): Promise<StudentEntity | null> {
    return await this.studentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}