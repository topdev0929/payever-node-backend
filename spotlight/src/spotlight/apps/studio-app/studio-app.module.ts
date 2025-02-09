import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { StudioMessageConsumer } from './consumers';

@Module({
  controllers: [
    StudioMessageConsumer,
  ],
  exports: [
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [
  ],
})
export class StudioAppModule { }
