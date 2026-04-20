import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const confg = new DocumentBuilder()
    .setTitle('Api_GRU')
    .setDescription('Api de gestor de residencia universitaria')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, confg);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
