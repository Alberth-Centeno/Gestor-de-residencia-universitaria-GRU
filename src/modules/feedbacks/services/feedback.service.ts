  import { Injectable, InternalServerErrorException } from "@nestjs/common";
  import { InjectRepository } from "@nestjs/typeorm";
  import { Feedback } from "../entities/feedback.entity";
  import { Repository } from "typeorm";
  import { CreateFeedbackDto, UpdateFeedbackDto } from "../dto/feedback.dto";



  @Injectable()
  export class FeedbackService{

    constructor(
      @InjectRepository(Feedback)
      private readonly feedbackRepository: Repository<Feedback>,
    ) {}

    async create(createFeedbackDto: CreateFeedbackDto) {

      try {

        console.log(
          'Datos listos para guardar:',
          createFeedbackDto,
        );

        const newFeedback =
          this.feedbackRepository.create({
          type: createFeedbackDto.type,
          content: createFeedbackDto.content,
          is_read: createFeedbackDto.is_read,
          student:{
            id: createFeedbackDto.student_id,
          }


            
        });

        await this.feedbackRepository.save(newFeedback);

        return newFeedback;

      } catch (error) {

        console.log(error);

        throw new InternalServerErrorException(
          'Error al crear feedback',
        );
      }
    }

    async findAll() {

      try {

        return await this.feedbackRepository.find({
          relations:['student']
        });

      } catch (error) {

        console.log(error);

        throw new InternalServerErrorException(
          'Error al encontrar feedbacks',
        );
      }
    }

    async findOne(id: number) {

      try {

        return await this.feedbackRepository.findOne({ 
          where : {id },
          relations: ['student'],
      });

      } catch (error) {

        console.log(error);

        throw new InternalServerErrorException(
          'Error al encontrar feedback',
        );
      }
    }

    async update(
      id: number,
      updateFeedbackDto: UpdateFeedbackDto,
    ) {

      try {

        await this.feedbackRepository.update(
          id,
          updateFeedbackDto,
        );

        return await this.findOne(id);

      } catch (error) {

        console.log(error);

        throw new InternalServerErrorException(
          'Error al actualizar feedback',
        );
      }
    }

    async remove(id: number) {

      try {

        return await this.feedbackRepository.delete(id);

      } catch (error) {

        console.log(error);

        throw new InternalServerErrorException(
          'Error al eliminar feedback',
        );
      }
    }
  }
