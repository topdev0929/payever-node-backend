import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { ProductsMessageConsumer } from './consumers';

@Module({
  controllers: [
    ProductsMessageConsumer,
  ],
  exports: [
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [
  ],
})
export class ProductsAppModule { }
