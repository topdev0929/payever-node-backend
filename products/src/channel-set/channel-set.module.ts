import { HttpModule, Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';

import { BusinessModule } from '../business/business.module';
import {
  BusinessSchema,
  BusinessSchemaName,
} from '../business/schemas';
import {
  SetupBusinessChannelSetCommand,
} from './commands';
import {
  ChannelSetBusMessageController,
} from './controllers';
import { ChannelSetEventsListener } from './event-listeners';
import { ChannelSetResolver } from './graphql/resolvers';
import {
  ChannelSetSchema,
  ChannelSetSchemaName,
} from './schemas';
import { ChannelSetService } from './services';
import { GqlErrorFormatter } from '../categories/error-formatters';
import { environment } from '../environments';

@Module({
  controllers: [
    ChannelSetBusMessageController,
  ],
  exports: [
    ChannelSetService,
  ],
  imports: [
    HttpModule,
    forwardRef(() => BusinessModule),
    MongooseModule.forFeature([
      {
        name: BusinessSchemaName,
        schema: BusinessSchema,
      },
      {
        name: ChannelSetSchemaName,
        schema: ChannelSetSchema,
      },
    ]),
    GraphQLModule.forRoot({
      context: ({ req }: { req: any }): { req: any } => ({ req }),
      cors: false,
      debug: !environment.production,
      disableHealthCheck: true,
      formatError: (error: any) => {
        return GqlErrorFormatter.formatError(error, environment.production);
      },
      include: [ChannelSetModule],
      path: '/channelset',
      typePaths: ['./src/channel-set/**/*.graphql'],
    }),
  ],
  providers: [
    SetupBusinessChannelSetCommand,
    ChannelSetEventsListener,
    ChannelSetResolver,
    ChannelSetService,
  ],
})
export class ChannelSetModule { }
