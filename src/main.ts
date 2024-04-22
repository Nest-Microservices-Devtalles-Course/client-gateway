import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {envs} from "./config";
import {Logger, RequestMethod, ValidationPipe} from "@nestjs/common";
import {RPCCustomExceptionFilter} from "./common";

async function bootstrap() {
  const logger = new Logger('Main-Gateway');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', {
    exclude: [{
      path: '',
      method: RequestMethod.GET,
    }]
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );
  app.useGlobalFilters(new RPCCustomExceptionFilter());
  await app.listen(envs.port);

  logger.log(`Running on port ${envs.port}`);
}

bootstrap();
