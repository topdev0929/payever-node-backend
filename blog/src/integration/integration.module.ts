import { Module } from '@nestjs/common';
import { IntegrationController } from './controllers';
import { CommentModule } from '../comment';
import { BusinessModuleLocal } from '../business';
import { BlogModule } from '../blog';

@Module({
  controllers: [
    IntegrationController,
  ],
  exports: [],
  imports: [
    BusinessModuleLocal,
    CommentModule,
    BlogModule,
  ],
  providers: [],
})
export class IntegrationModule { }
