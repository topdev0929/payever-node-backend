import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomAccessService } from './services';
import { CustomAccessSchemaEnum } from './enums';
import { CustomAccessSchema } from './schemas';
import { CustomAccessConsumer } from './consumers';

@Module({
  controllers: [
    CustomAccessConsumer,
  ],
  exports: [
    CustomAccessService,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: CustomAccessSchemaEnum.customAccess,
        schema: CustomAccessSchema,
      },
    ]),
  ],
  providers: [
    CustomAccessService,
  ],
})

export class CustomAccessModule { }

