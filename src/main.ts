import serverlessExpress from '@codegenie/serverless-express';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Callback, Context, Handler } from 'aws-lambda';
import { configDotenv } from 'dotenv';
import packageJson from '../package.json';
import { AppModule } from './app.module';

configDotenv();
let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);

  if (Boolean(process.env.ENABLE_DOCUMENTATION) === true) {
    setupSwagger(app);
  }

  setupCors(app);
  setupClassValidator(app);

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};

function setupCors(app: INestApplication) {
  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Customer-Request',
  };

  app.enableCors(corsOptions);
}

function setupClassValidator(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
}

function setupSwagger(app: INestApplication) {
  const version = packageJson?.version || '1.0.0';

  const options = new DocumentBuilder()
    .setTitle('Customers API')
    .setDescription('Customers REST API documentation')
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
