import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlockEmailSchema, BlockEmailSchemaName } from './schemas/block-email.schema';
import { BlockEmailService } from './services';
import { LoginListener, RegisterListener } from './event-listeners';
import { AdminController } from './controllers';
import { SyncBlockedEmailsCron } from './cron';

@Module({
  controllers: [ AdminController ],
  exports: [BlockEmailService],
  imports: [
    MongooseModule.forFeature([
      {
        name: BlockEmailSchemaName,
        schema: BlockEmailSchema,
      },
    ]),
 ],
  providers: [
    BlockEmailService, 
    LoginListener, 
    RegisterListener, 
    SyncBlockedEmailsCron,
  ],
})
export class BlockEmailModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
