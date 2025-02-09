import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from '../products';
import {
  CategoriesPredictorService,
} from './services';
import { CategoryMappingSchema, CategoryMappingSchemaName, TrainedDataSchema, TrainedDataSchemaName } from './schemas';
import { CategoriesModule } from '../categories/categories.module';
import { CategoryPredictorController } from './controllers';

@Module({
  controllers: [
    CategoryPredictorController,
  ],
  exports: [
    CategoriesPredictorService,
  ],
  imports: [
    HttpModule,
    forwardRef(() => ProductsModule.forRoot()),
    CategoriesModule,
    MongooseModule.forFeature([
      { name: CategoryMappingSchemaName, schema: CategoryMappingSchema, collection: 'category-mappings' },
      { name: TrainedDataSchemaName, schema: TrainedDataSchema, collection: 'trained-data' },
    ]),
  ],
  providers: [
    CategoriesPredictorService,
  ],
})
export class CategoriesPredictorModule { }
