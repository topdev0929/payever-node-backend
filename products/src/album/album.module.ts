import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule } from '../business/business.module';
import { AlbumSchema, AlbumSchemaName } from './schemas';
import { BusinessSchema, BusinessSchemaName } from '../business/schemas';
import { AlbumService } from './services';
import { GraphQLModule } from '@nestjs/graphql';
import { environment } from '../environments';
import { GqlErrorFormatter } from '../categories/error-formatters';
import { AlbumResolver } from './graphql/resolvers';

@Module({
  controllers: [
  ],
  exports: [
    AlbumService,
  ],
  imports: [
    HttpModule,
    BusinessModule,
    MongooseModule.forFeature([
      {
        name: BusinessSchemaName,
        schema: BusinessSchema,
      },
      {
        name: AlbumSchemaName,
        schema: AlbumSchema,
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
      include: [AlbumModule],
      path: '/album',
      typePaths: ['./src/album/**/*.graphql'],
    }),
  ],
  providers: [
    AlbumService,
    AlbumResolver,
  ],
})
export class AlbumModule { }
