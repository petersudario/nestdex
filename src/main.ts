import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  var cors = require('cors')
  app.use(cors())

  app.useStaticAssets(join(__dirname, '..', 'client', 'build'));

  app.use((req: Request, res: Response, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(__dirname, '..', 'client', 'build', 'index.html'));
    } else {
      next(); 
    }
  });

  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  const config = new DocumentBuilder()
    .setTitle('Pokedex API')
    .setDescription('API para gerenciar Pokémons')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3001);
}
bootstrap();
