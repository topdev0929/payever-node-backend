import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { Products, SubscriptionPlanService } from '../services';
import { ProductExportedDto, ProductRmqMessageDto, ProductRemovedDto } from '../dto';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { ProductModel } from '../models';
import { RabbitBinding, RabbitChannelsEnum } from '../../environments';

@Controller()
export class ProductsBusMessageController {
  constructor(
    private readonly productsService: Products,
    private readonly subscriptionPlanService: SubscriptionPlanService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.BillingSubscription,
    name: RabbitBinding.ProductExported,
  })
  public async onProductExported(data: ProductExportedDto): Promise<void> {
    return this.productsService.upsertByExport(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.BillingSubscription,
    name: RabbitBinding.ProductUpdated,
  })
  public async onProductUpdated(data: ProductRmqMessageDto): Promise<ProductModel> {
    const dto: ProductRmqMessageDto = plainToClass(ProductRmqMessageDto, data);
    await ProductsBusMessageController.validate(dto);
    const product: ProductModel = await this.productsService.getById(data._id);

    if (!product) {
      return;
    }

    return this.productsService.updateProduct(dto);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.BillingSubscription,
    name: RabbitBinding.ProductRemoved,
  })
  public async onProductRemoved(data: ProductRemovedDto): Promise<void> {
    const product: ProductModel = await this.productsService.getById(data._id);

    if (!product) {
      return;
    }

    await this.subscriptionPlanService.removeSubscriptionPlansAndSubscriptionsByProduct(product);
    await this.productsService.removeProduct(product);
  }

  private static async validate(object: object): Promise<void> {
    const errors: ValidationError[] = await validate(object);

    if (errors.length) {
      throw errors;
    }
  }
}
