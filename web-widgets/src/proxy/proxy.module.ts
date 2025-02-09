import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WidgetActionsController, ClientWidgetActionsController, ClientController } from './controllers';
import { IntegrationSchema, IntegrationSchemaName } from './schemas';
import { ServiceUrlRetriever, IntegrationService } from './services';
import { ProxyOptionsInterface } from './proxy-options.interface';
import { IntercomModule } from '@pe/nest-kit';

@Module({
  controllers: [
    WidgetActionsController,
    ClientWidgetActionsController,
    ClientController,
  ],
  exports: [ ],
  imports: [
    HttpModule,
    IntercomModule,
    MongooseModule.forFeature([
      { name: IntegrationSchemaName, schema: IntegrationSchema },
    ]),
  ],
  providers: [
    IntegrationService,
  ],
})

export class ProxyModule {
  public static forRoot(options: ProxyOptionsInterface): DynamicModule {
    return {
      exports: [
        ServiceUrlRetriever,
      ],
      module: ProxyModule,
      providers: [
        {
          provide: ServiceUrlRetriever,
          useValue: new ServiceUrlRetriever(options.env),
        },
      ],
    };
  }

}
