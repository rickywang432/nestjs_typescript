import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import config from './app.config';
import { AppModule } from './app.module';
import * as typeOrmExt from './tools/typeorm-ext';
//import { DebugExceptionFilter } from './debug-exception.filter';

// Initialize the module
typeOrmExt.init();

async function bootstrap() {

    const fastify = new FastifyAdapter({ logger: true });
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastify, { cors: true });

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
        new ValidationPipe({
            disableErrorMessages: config.environment == 'production',
            whitelist: true,
            transform: true,
            skipMissingProperties: false,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
        })
    );

    if (config.environment == 'development' || config.environment == 'staging') {
        // Provide debug information in response
        //app.useGlobalFilters(new DebugExceptionFilter());

        // Swagger
        const options = new DocumentBuilder()
            .setTitle('Blitz Team Coaching API')
            .setDescription('Provides services to the Blitz app.')
            .setVersion('1.0')
            .setSchemes('http', 'https')
            .setBasePath('api/v1')
            .addBearerAuth()
            // .addTag('...')
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('swagger', app, document);
    }

    await app.listen(config.api.port, config.api.host);
}
bootstrap();
