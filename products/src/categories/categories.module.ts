import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';

import {
  CategoriesEsExportCommand,
  CategoriesEsSetupCommand,
  CollectionsEsExportCommand,
  CollectionsEsSetupCommand,
} from './commands';
import {
  CategoryExistsConstraint,
  CollectionExistsConstraint,
  UniqueCategoryNameConstraint,
  UniqueCategorySlugConstraint,
} from './constraints';
import { CollectionController } from './controllers';
import { ProductsCategoriesEventsProducer, ProductsCollectionsEventsProducer } from './producers';
import {
  CategorySchema,
  CategorySchemaName,
  CollectionSchema,
  CollectionSchemaName,
  DefaultCategorySchema,
  DefaultCategorySchemaName,
} from './schemas';
import {
  CategoryElasticService,
  CategoryService,
  CollectionElasticService,
  CollectionsService,
  DefaultCategoriesService,
  FilterService,
  OldCategoriesMapperService,
} from './services';
import { CategoryCreateVoter, CategoryDeleteVoter, CategoryUpdateVoter, CollectionDeleteVoter } from './voters';
import { CategoriesResolver } from './graphql/resolvers/categories.resolver';
import { environment } from '../environments';
import { GqlErrorFormatter } from './error-formatters';
import { CounterModule } from '../counter';
import { productBaseSchema } from '../products/schemas/product-base.schema';

@Module({
  controllers: [
    CollectionController,
  ],
  exports: [
    CategoryService,
    CategoryElasticService,
    CollectionElasticService,
    DefaultCategoriesService,
    OldCategoriesMapperService,
    CollectionsService,
    ProductsCollectionsEventsProducer,
  ],
  imports: [
    CounterModule,
    GraphQLModule.forRoot({
      context: ({ req }: { req: any }): { req: any } => ({ req }),
      cors: false,
      debug: !environment.production,
      disableHealthCheck: true,
      formatError: (error: any) => {
        return GqlErrorFormatter.formatError(error, environment.production);
      },
      include: [CategoriesModule],
      path: '/categories',
      typePaths: ['./src/categories/**/*.graphql'],
    }),
    MongooseModule.forFeature([
      { name: CategorySchemaName, schema: CategorySchema },
      { name: CollectionSchemaName, schema: CollectionSchema },
      { name: DefaultCategorySchemaName, schema: DefaultCategorySchema },
      { name: 'ProductBase', schema: productBaseSchema, collection: 'products' },
    ],
  )],
  providers: [
    // Commands
    CategoriesEsExportCommand,
    CategoriesEsSetupCommand,
    CollectionsEsExportCommand,
    CollectionsEsSetupCommand,
    // Constraits
    CategoryExistsConstraint,
    CollectionExistsConstraint,
    UniqueCategoryNameConstraint,
    UniqueCategorySlugConstraint,
    // Producers
    ProductsCollectionsEventsProducer,
    ProductsCategoriesEventsProducer,
    // Services
    CategoryService,
    CategoriesResolver,
    CollectionsService,
    CategoryElasticService,
    CollectionElasticService,
    DefaultCategoriesService,
    FilterService,
    OldCategoriesMapperService,
    // Voter
    CategoryCreateVoter,
    CategoryUpdateVoter,
    CategoryDeleteVoter,
    CollectionDeleteVoter,
  ],
})
export class CategoriesModule { }
