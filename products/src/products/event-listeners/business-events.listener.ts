import { Injectable } from '@nestjs/common';
import { BusinessModel } from '../../business/models';
import { ProductCategoriesService, ProductService, ProductSettingsService } from '../services';
import { BusinessEventsEnums } from '../../business/enums';
import { BusinessDto } from '../../business/dto';
import { EventListener } from '@pe/nest-kit';

@Injectable()
export class BusinessEventsListener {
  constructor(
    private readonly productService: ProductService,
    private readonly productsCategoriesService: ProductCategoriesService,
    private readonly productsSettingsService: ProductSettingsService,
  ) { }

  @EventListener(BusinessEventsEnums.BusinessRemoved)
  public async onBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.productService.removeByBusinessId(business.id);
    await this.productsCategoriesService.removeByBusinessId(business.id);
    await this.productsSettingsService.removeByBusinessId(business.id);
  }

  @EventListener(BusinessEventsEnums.BusinessCreated)
  private async onBusinessCreated(businessDto: BusinessDto): Promise<void> {
    const businessId: string = businessDto._id;
    const currency: string = businessDto.currency;

    await this.productsSettingsService.createProductSettings(businessId, currency);
    await this.productsCategoriesService.createDefaultCategories(businessId);
    await this.productService.createSampleProducts(businessDto);
  }

  @EventListener(BusinessEventsEnums.BusinessUpdated)
  private async onBusinessUpdated(businessDto: BusinessDto): Promise<void> {
    const businessId: string = businessDto._id;
    const currency: string = businessDto.currency;

    await this.productService.setProductsCurrency(businessId, currency);

    await this.productsSettingsService.setCurrency(businessId, currency);
  }
}
