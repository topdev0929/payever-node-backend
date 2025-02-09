import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PosTerminalSchema, PosTerminalSchemaName } from './schemas';
import { PosService } from './services';
import { PosMessagesConsumer } from './consumers';

@Module({
  controllers: [
    PosMessagesConsumer,
  ],
  exports: [
    PosService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: PosTerminalSchemaName, schema: PosTerminalSchema },
      ],
    ),
  ],
  providers: [
    PosService,
  ],
})
export class PosAppModule { }
