import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ProductsService } from '../services';
import { ProductDto, ProductRmqMessageDto } from '../dto';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { ProductModel } from '../models';
import { RabbitBinding } from '../enums/rabbit-binding.enum';
import { RabbitChannelsEnum } from '../enums/rabbit-channels.enum';

@Controller()
export class ProductsBusMessageConsumer {
  constructor(
    private readonly productsService: ProductsService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Affiliates,
    name: RabbitBinding.ProductUpdated,
  })
  public async onProductUpdated(data: ProductRmqMessageDto): Promise<ProductModel> {
    const dto: ProductRmqMessageDto = plainToClass(ProductRmqMessageDto, data);
    await ProductsBusMessageConsumer.validate(dto);
    const product: ProductModel = await this.productsService.getById(data._id);

    if (!product) {
      return;
    }

    return this.productsService.update(product, dto as ProductDto);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Affiliates,
    name: RabbitBinding.ProductRemoved,
  })
  public async onProductRemoved(data: ProductRmqMessageDto): Promise<void> {
    const product: ProductModel = await this.productsService.getById(data._id);

    if (!product) {
      return;
    }

    await this.productsService.delete(product);
  }

  private static async validate(object: object): Promise<void> {
    const errors: ValidationError[] = await validate(object);

    if (errors.length) {
      throw errors;
    }
  }
}
