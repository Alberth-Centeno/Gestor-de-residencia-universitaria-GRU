import { Module } from '@nestjs/common';
import { StudentsModule } from './modules/students/students.module';
import { ExitPermitsModule } from './modules/exit_permits/exit_permits.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({

  imports: [
    StudentsModule,
    TasksModule,
    ExitPermitsModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot(),
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
