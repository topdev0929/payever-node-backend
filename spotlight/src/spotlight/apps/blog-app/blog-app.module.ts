import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { BlogMessagesConsumer } from './consumers';


@Module({
  controllers: [
    BlogMessagesConsumer,
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [

  ],
})

export class BlogAppModule { }

