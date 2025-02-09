import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SignupsController } from './signups.controller';
import { SignupsService } from './signups.service';
import { SignupsSchema, SignupsSchemaName } from './signup.schema';
import { BaseCrmEventListener } from './base-crm-event.listener';

@Module({
  controllers: [
    SignupsController,
  ],
  exports: [
    SignupsService,
  ],
  imports: [
    MongooseModule.forFeature([{
      name: SignupsSchemaName,
      schema: SignupsSchema,
    }]),
  ],
  providers: [
    SignupsService,
    BaseCrmEventListener,
  ],
})
export class SignupsModule {
}
