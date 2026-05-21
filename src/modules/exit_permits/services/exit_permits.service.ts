import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ExitPermit } from '../entities/exit_permits.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExitPermitDto } from '../dto/exit_permit.dto';

@Injectable()
export class ExitPermitsService {
    constructor(
        @InjectRepository(ExitPermit)
        private readonly exit_permitsRepository: Repository<ExitPermit>,
    ) {}

    async create(createExitPermitDto: CreateExitPermitDto ){
        try{
            console.log('Datos listos para guardar :', createExitPermitDto);
            const newExitPermit = this.exit_permitsRepository.create(createExitPermitDto);
            await this.exit_permitsRepository.save(newExitPermit);
            return newExitPermit;
        }catch(error){
            console.log(error);
            throw new InternalServerErrorException('Error al guardar el registro');
        }
    }

    async findAll(){
        try{
            return await this.exit_permitsRepository.find();
        }catch(error){
            console.log(error);
            throw new InternalServerErrorException('Error al obtener todos los registros');
        }
    }

    async findOne(id: number) {
        const permit = await this.exit_permitsRepository.findOneBy({ id });
        if (!permit) {
            throw new NotFoundException(`El permiso de salida con ID ${id} no fue encontrado`);
        }
        return permit;
    }

    async update(id: number, updateExitPermitDto: Partial<CreateExitPermitDto>) {
        try {
            const permit = await this.findOne(id);
            
            const updatedPermit = this.exit_permitsRepository.merge(permit, updateExitPermitDto);
            return await this.exit_permitsRepository.save(updatedPermit);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            console.log(error);
            throw new InternalServerErrorException('Error al actualizar el registro');
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