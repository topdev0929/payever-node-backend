import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CounterService } from './services';
import { CounterSchema, CounterSchemaName } from './schemas/counter.schema';

@Module({
  controllers: [
  ],
  exports: [
    CounterService,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: CounterSchemaName,
        schema: CounterSchema,
      },
    ]),
  ],
  providers: [
    CounterService,
  ],
})
export class CounterModule { }
