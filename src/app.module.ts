import { Module } from '@nestjs/common';
import { StudentsModule } from './modules/students/students.module';
import { TasksModule } from './modules/tasks/tasks.module';
import{FileModule} from './modules/files/files.module';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports: [StudentsModule, TasksModule,FileModule,ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      entities: [StudentsModule],
    }),
  ],
  controllers: [],
  providers: [],

})
export class AppModule {}
