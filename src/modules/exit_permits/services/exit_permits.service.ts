import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ExitPermit } from '../entities/exit_permits.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExitPermitDto, UpdateExitPermitDto } from '../dto/exit_permit.dto';
import { StudentService } from '../../students/services/student.service'; 
@Injectable()
export class ExitPermitsService {
    constructor(
        @InjectRepository(ExitPermit)
        private readonly exit_permitsRepository: Repository<ExitPermit>,
        private readonly studentService: StudentService, // <-- 2. Inyectamos para validar al alumno
    ) {}

    async create(createExitPermitDto: CreateExitPermitDto) {
        // Validar que el estudiante realmente exista en el sistema
        await this.studentService.findOne(createExitPermitDto.student_id);

        try {
            const newExitPermit = this.exit_permitsRepository.create(createExitPermitDto);
            return await this.exit_permitsRepository.save(newExitPermit);
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Error al guardar el registro del pase de salida');
        }
    }

    async findAll() {
        try {
            // Traemos las relaciones mapeadas para que Postman devuelva objetos completos
            return await this.exit_permitsRepository.find({
                relations: ['student', 'inspector', 'guard_departure', 'guard_return'],
                order: { id: 'DESC' }
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Error al obtener todos los pases de salida');
        }
    }

    async findOne(id: number) {
        // Buscamos incluyendo la información de sus relaciones
        const permit = await this.exit_permitsRepository.findOne({
            where: { id },
            relations: ['student', 'inspector', 'guard_departure', 'guard_return']
        });
        
        if (!permit) {
            throw new NotFoundException(`El permiso de salida con ID ${id} no fue encontrado`);
        }
        return permit;
    }

    async update(id: number, updateExitPermitDto: UpdateExitPermitDto) {
        try {
            const permit = await this.findOne(id);
            
            // Si mandan un DTO con cambio de estudiante, verificamos que exista
            if (updateExitPermitDto.student_id) {
                await this.studentService.findOne(updateExitPermitDto.student_id);
            }

            // Aplicamos el fix 'as any' para evitar bloqueos de tipos de TypeScript
            const updatedPermit = this.exit_permitsRepository.merge(permit, updateExitPermitDto as any);
            return await this.exit_permitsRepository.save(updatedPermit);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            console.log(error);
            throw new InternalServerErrorException('Error al actualizar el registro del pase de salida');
        }
    }

    async remove(id: number) {
        try {
            const permit = await this.findOne(id);
            await this.exit_permitsRepository.remove(permit);
            return { message: `Permiso con ID ${id} eliminado con éxito` };
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            console.log(error);
            throw new InternalServerErrorException('Error al eliminar el registro');
        }
    }
}