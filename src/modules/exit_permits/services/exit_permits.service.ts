import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
            throw new  InternalServerErrorException('Error al guardar el registro');
        }
    }
    async findAll(){
        try{
            return await this.exit_permitsRepository.find();
        }catch(error){
            console.log(error);
            throw new  InternalServerErrorException('Error al obtener todos los registros');
        }
    }
}
