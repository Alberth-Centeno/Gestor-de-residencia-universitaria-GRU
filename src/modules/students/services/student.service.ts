import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StudentEntity, shifType } from '../entities/student.entity';
import { UserService } from '../../users/services/user.service';
import { CreateStudentDto, UpdateStudentDto } from '../dto/student.dto';

@Injectable()
export class StudentService {
  delete(id: number) {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,

    private readonly userService: UserService,
  ) {}

  async create(createStudentData: CreateStudentDto) {
    const {
      user_id,
      student_code,
      first_name,
      last_name,
      career,
      shift,
      room_number,
      scholarship_status,
    } = createStudentData;

    const existingUser = await this.userService.findOne(user_id);

    if (!existingUser) {
      throw new NotFoundException(
        `No se puede crear el estudiante porque el usuario con ID ${user_id} no existe.`,
      );
    }

    try {
      const newStudent = this.studentRepository.create({
        user_id,
        student_code,
        first_name,
        last_name,
        career,
        shift,
        room_number,
        scholarship_status,
        user: existingUser,
      });

      return await this.studentRepository.save(newStudent);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === '23505'
      ) {
        throw new ConflictException(
          'El carnet estudiantil o el ID de usuario ya están registrados en otro perfil.',
        );
      }

      console.error('Error al guardar estudiante:', error);

      throw new InternalServerErrorException(
        'Error interno al crear el perfil del estudiante.',
      );
    }
  }

  async findAll() {
    return await this.studentRepository.find({
      withDeleted: true,
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['user'],
      withDeleted: true,
    });

    if (!student) {
      throw new NotFoundException(
        `Estudiante con ID ${id} no encontrado.`,
      );
    }

    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      const student = await this.findOne(id);

      if (
        updateStudentDto.user_id &&
        updateStudentDto.user_id !== student.user_id
      ) {
        const existingUser = await this.userService.findOne(
          updateStudentDto.user_id,
        );

        if (!existingUser) {
          throw new NotFoundException(
            `No se puede actualizar: El usuario con ID ${updateStudentDto.user_id} no existe.`,
          );
        }

        student.user = existingUser;
      }

      const updatedStudent = this.studentRepository.merge(
        student,
        updateStudentDto,
      );

      return await this.studentRepository.save(updatedStudent);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === '23505'
      ) {
        throw new ConflictException(
          'El carnet estudiantil ya está registrado en otro perfil.',
        );
      }

      console.error('Error al actualizar estudiante:', error);

      throw new InternalServerErrorException(
        'Error interno al actualizar el perfil del estudiante.',
      );
    }
  }

  async Delete(id: number) {
    try {
      const student = await this.findOne(id);

      await this.studentRepository.remove(student);

      return;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error('Error al eliminar estudiante:', error);

      throw new InternalServerErrorException(
        'Error interno al eliminar el perfil del estudiante.',
      );
    }
  }

  /**
   * Obtiene todos los estudiantes disponibles.
   */
  async getAvailableStudents(
    targetDate: Date,
  ): Promise<StudentEntity[]> {
    return await this.studentRepository.find({
      relations: ['user'],
    });
  }

  /**
   * Obtiene estudiantes por turno.
   * Este método será utilizado por el módulo Tasks
   * para asignar tareas según disponibilidad académica.
   */
  async getStudentsByShift(
    shift: shifType,
  ): Promise<StudentEntity[]> {
    return await this.studentRepository.find({
      where: { shift },
      relations: ['user'],
    });
  }
}