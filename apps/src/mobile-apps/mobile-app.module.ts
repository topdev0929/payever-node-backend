import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MobileAppController } from './controllers/mobile-app.controller';
import { MobileAppSchema, MobileAppSchemaName } from './schemas/mobile-app.schema';

@Module({
  controllers: [MobileAppController],
  imports: [HttpModule, MongooseModule.forFeature([{ name: MobileAppSchemaName, schema: MobileAppSchema }])],
})
export class MobileAppModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
