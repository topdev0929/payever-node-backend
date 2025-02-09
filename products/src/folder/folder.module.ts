import { HttpModule, Module, forwardRef } from '@nestjs/common';

import { 
  FolderSchema,
  FolderSchemaName,
  FolderItemLocation,
  FolderItemLocationSchema,
  FoldersPluginModule,
} from '@pe/folders-plugin';
import { RulesSdkModule } from '@pe/rules-sdk';
import { 
  CleanDropshippingFoldersCommand,
  SetupDefaultFoldersCommand,
} from './commands';
import { FoldersConfig, RulesOptions } from './config';
import {
  ProductFolderDocumentsController,
} from './controllers';
import {
  ProductFolderDocumentsService,
} from './services';
import { ProductsModule } from '../products/products.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [
    ProductFolderDocumentsController,
  ],
  exports: [
    FoldersPluginModule,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: FolderSchemaName,
        schema: FolderSchema,
      },
      {
        name: FolderItemLocation.name,
        schema: FolderItemLocationSchema,
      },
    ]),
    FoldersPluginModule.forFeature(FoldersConfig),
    RulesSdkModule.forRoot(RulesOptions),
    forwardRef(() => ProductsModule.forRoot()),
  ],
  providers: [
    SetupDefaultFoldersCommand,
    CleanDropshippingFoldersCommand,
    ProductFolderDocumentsService,
  ],
})
export class FolderModule {
}
