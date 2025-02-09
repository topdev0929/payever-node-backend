import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../environments';
import { ChannelSchemaName, ChannelSchema } from '@pe/channels-sdk/module/schemas';
import { ApmModule, ApmService } from '@pe/nest-kit';
import { AdminChannelsController } from './controllers/admin-channel.controller';
import { ChannelService } from './services';

@Module({
  controllers: [
    AdminChannelsController,
  ],
  exports: [
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: ChannelSchemaName,
        schema: ChannelSchema,
      },
    ]),
    ApmModule.forRoot(environment.apm.enable, environment.apm.options),
    ApmService,
  ],
  providers: [
    ApmService,
    ChannelService,
  ],
})
export class AdminChannelModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
