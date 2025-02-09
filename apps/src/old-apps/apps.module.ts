import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppsController } from './controllers/apps.controller';
import { AppSchema } from './schemas/apps.schema';
import { AppsService } from './services/apps.service';

@Module({
  controllers: [AppsController],
  imports: [HttpModule, MongooseModule.forFeature([{ name: 'App', schema: AppSchema }])],
  providers: [AppsService],
})
export class AppsModule { }
