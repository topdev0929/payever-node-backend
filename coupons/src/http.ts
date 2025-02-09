import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import * as qs from 'qs';
import { useContainer } from 'class-validator';

import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';

import { ApplicationModule } from './app.module';
import { environment } from './environments';
import {
    CouponTypeFixedDto,
    CouponTypeBuyXGetYDto,
    CouponTypePercentageDto,
    CouponTypeFreeShippingDto,
} from './coupons/dto';

async function bootstrap(): Promise<void> {
    const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
        ApplicationModule,
        new FastifyAdapter({
            maxParamLength: 255,
            querystringParser: (str: string): any => qs.parse(str),
        }),
    );

    useContainer(app.select(ApplicationModule), {
        fallback: true,
        fallbackOnErrors: true,
    });

    const logger: NestKitLogger = app.get(NestKitLogger);
    app.useLogger(logger);

    app.useGlobalPipes(new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        whitelist: true,
    }));
    app.setGlobalPrefix('/api');

    const options: DocumentBuilder = new DocumentBuilder()
        .setTitle('Coupons')
        .setDescription('Coupons micro API description')
        .setVersion('1.0')
        .addTag('coupons')
        .addBearerAuth();

    if (environment.production) {
        options.addServer('https://');
    }

    const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build(), {
        //  @FIXME: It seems `extraModels` prop require `@nestjs/swagger@4`. Not working now
        extraModels: [
            CouponTypePercentageDto,
            CouponTypeFixedDto,
            CouponTypeBuyXGetYDto,
            CouponTypeFreeShippingDto,
        ],
    } as any);
    SwaggerModule.setup('api-docs', app, document);

    app.enableShutdownHooks();

    await app.listen(
        environment.port,
        '0.0.0.0',
        () => logger.log(`Coupons application started at port [${environment.port}].`, 'NestApplication'),
    );
}

void bootstrap().then();
