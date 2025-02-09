import { Module } from '@nestjs/common';
import { ContactService, GroupService } from './services';
import { IntercomModule } from '@pe/nest-kit';
import { ContactMessagesConsumer, GroupMessagesConsumer } from './consumers';
import { ContactSchemaName, ContactSchema, GroupSchemaName, GroupSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [
    ContactMessagesConsumer,
    GroupMessagesConsumer,
  ],
  exports: [
    ContactService,
    GroupService,
  ],
  imports: [
    IntercomModule,
    MongooseModule.forFeature(
      [
        { name: ContactSchemaName, schema: ContactSchema },
        { name: GroupSchemaName, schema: GroupSchema },
      ],
    ),
  ],
  providers: [
    ContactService,
    GroupService,
  ],
})
export class ContactAppModule { }
