import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema, BlogSchemaName } from './schemas';
import { BlogService } from './services';
import { BlogMessagesConsumer } from './consumers';

@Module({
  controllers: [
    BlogMessagesConsumer,
  ],
  exports: [
    BlogService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: BlogSchemaName, schema: BlogSchema },
      ],
    ),
  ],
  providers: [
    BlogService,
  ],
})
export class BlogAppModule { }
