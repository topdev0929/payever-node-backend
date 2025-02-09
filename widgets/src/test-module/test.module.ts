import { HttpModule, Module } from '@nestjs/common';
import { TestController } from './controllers';

@Module({
  controllers: [
    TestController,
  ],
  imports: [
    HttpModule,
  ],
  providers: [],
})
export class TestModule { }
