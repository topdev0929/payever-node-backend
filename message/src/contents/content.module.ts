import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IntercomModule } from '@pe/nest-kit';
import { ContentsController } from './controllers';
import {
  ContentSchema,
  ContentSchemaName,
} from './schemas';
import { ContentService, ContentDataService } from './services';

@Module({
  controllers: [
    ContentsController,
  ],
  exports: [
    ContentService,
    ContentDataService,
  ],
  imports: [
    HttpModule,
    IntercomModule,

    MongooseModule.forFeature([{
      name: ContentSchemaName,
      schema: ContentSchema,
    }]),
  ],
  providers: [
    ContentService,
    ContentDataService,
  ],
})
export class ContentModule { }
