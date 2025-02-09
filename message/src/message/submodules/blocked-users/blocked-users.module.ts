import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  BlockedUserSchema,
  BlockedUserSchemaName,
} from './schemas';
import { BlockedUsersService } from './services';

@Module({
  exports: [
    BlockedUsersService,
  ],
  imports: [
    MongooseModule.forFeature([{
      name: BlockedUserSchemaName,
      schema: BlockedUserSchema,
    }]),
  ],
  providers: [
    BlockedUsersService,
  ],
})
export class BlockedUsersModule { }
