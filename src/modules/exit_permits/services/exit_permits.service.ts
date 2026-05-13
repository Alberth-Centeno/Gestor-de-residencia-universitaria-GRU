import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExitPermit } from '../entities/exit_permits.entity';
import { CreateExitPermitDto } from '../dto/exit_permit.dto';
import { Repository } from 'typeorm';


@Injectable()
export class ExitPermitsService {
    constructor(
      @InjectRepository(ExitPermit)
      private readonly exitPermitsRepository: Repository<ExitPermit>,
    ){}

    async create(CreateExitPermitDto: CreateExitPermitDto){
        try {
            console.log('Datos liostos para guardar exit permits',CreateExitPermitDto);
            const newExitPermit = this.exitPermitsRepository.create(CreateExitPermitDto);
            await this.exitPermitsRepository.save(newExitPermit);
            return newExitPermit;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Error al crear exit permits');
        }
    }
    async findAll(){
        try {
            return await this.exitPermitsRepository.find();
        }catch(error){
            console.log(error);
            throw new InternalServerErrorException('Error al obtener exit permits');
        }
    }
}
