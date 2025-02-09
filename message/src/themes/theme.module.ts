import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BubbleController, ThemesController } from './controllers';
import { BubbleService, ThemeService } from './services';
import {
  BubbleSchemaName,
  BubbleSchema,
  ThemeSchemaName,
  ThemeSchema,
} from './schemas';

@Module({
  controllers: [
    BubbleController,
    ThemesController,
  ],
  exports: [
    BubbleService,
    ThemeService,
  ],
  imports: [
    MongooseModule.forFeature([{
      name: BubbleSchemaName,
      schema: BubbleSchema,
    }, {
      name: ThemeSchemaName,
      schema: ThemeSchema,
    }]),
  ],
  providers: [
    BubbleService,
    ThemeService,
  ],
})
export class ThemeModule { }
