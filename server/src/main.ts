import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnv } from './utils/config/get-env';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const { port, helmet: useHelmet, openApi: useOpenApi, https } = getEnv();

  const app = await NestFactory.create(
    AppModule,
    https
      ? {
          httpsOptions: {
            key: fs.readFileSync('/app/server/certificates/key.pem'),
            cert: fs.readFileSync('/app/server/certificates/cert.pem'),
          },
        }
      : {},
  );

  if (useHelmet) app.use(helmet());

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  if (useOpenApi) {
    const config = new DocumentBuilder()
      .setTitle('Lectio API')
      .setDescription('The open books manager API')
      .setVersion('1.0.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('documentation', app, document);
  }

  await app.listen(port);
}
bootstrap();
