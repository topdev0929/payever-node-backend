import { Injectable } from '@nestjs/common';
import { SampleProductsEventsEnum } from '../enums';
import { ProductModel } from '../../products/models';
import { SampleProductsEventsProducer } from '../producers';
import { EventListener } from '@pe/nest-kit';
import { BusinessDto } from '../../business/dto';

@Injectable()
export class SampleProductEventsListener {
  constructor(
    private sampleProductsEventsProducer: SampleProductsEventsProducer,
  ) { }

  @EventListener(SampleProductsEventsEnum.SampleProductsCreated)
  private async handleProductCreated(businessDto: BusinessDto, products: ProductModel[]): Promise<void> {
    await this.sampleProductsEventsProducer.sampleProductsCreated(businessDto, products);
  }
}
