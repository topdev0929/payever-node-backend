import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PosMessagesConsumer } from './consumers';
import { TerminalSchema, TerminalSchemaName } from './schemas';
import { PosService } from './services/pos.service';

@Module({
  controllers: [
    PosMessagesConsumer,
  ],
  exports: [PosService],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [{ name: TerminalSchemaName, schema: TerminalSchema }],
    ),
  ],
  providers: [
    PosService,
  ],
})
export class PosModule { }
