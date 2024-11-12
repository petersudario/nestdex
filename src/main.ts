import { NestFactory } from '@nestjs/core';

import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Request, Response } from 'express';
import appConfig from './app.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  appConfig(app);


    app.useStaticAssets(join(__dirname, '..', 'client', 'build'));

    app.use((req: Request, res: Response, next) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(join(__dirname, '..', 'client', 'build', 'index.html'));
      } else {
        next(); 
      }
    });

    // cors -> permitir que outro domínio faça requests na sua aplicação
    app.enableCors({
      origin: 'http://localhost:3000',
    });
  

  const documentBuilderConfig = new DocumentBuilder()
    .setTitle('Recados API')
    .setDescription('Envie recados para seus amigos e familiares')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilderConfig);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.APP_PORT);
}
bootstrap();