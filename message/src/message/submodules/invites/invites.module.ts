import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatInviteService } from './services';
import { ChatInviteSchema, ChatInviteSchemaName } from './schemas';
import { PlatformModule } from '../platform';

@Module({
  exports: [
    ChatInviteService,
  ],
  imports: [
    MongooseModule.forFeature([{
      name: ChatInviteSchemaName,
      schema: ChatInviteSchema,
    }]),
    PlatformModule,
  ],
  providers: [
    ChatInviteService,
  ],
})
export class InvitesModule { }
