import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional } from '@pe/nest-kit';
import { ProductModel } from '../models';
import { ProductService } from '../services';
import { MediaAdditionalImageTypesEnum, MediaContainersEnum, MediaEventsPublisher } from '@pe/media-sdk';
import { PaginationDto } from '../dto';

@Injectable()
export class RequestAdditionalImagesCommand {
  constructor(
    private readonly productService: ProductService,
    private readonly publisher: MediaEventsPublisher,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'media:request-additional-images <imageType>',
    describe: 'Requests creation of additional images',
  })
  public async requestAdditionalImages(
    @Positional({ name: 'imageType' }) imageType: MediaAdditionalImageTypesEnum,
  ): Promise<void> {
    const pagination: PaginationDto = {
      limit: 100,
      page: 1,
    };

    let processedProductsCount: number = 0;
    while (true) {
      const products: ProductModel[] = await this.productService.getProductsList({ }, pagination, null, []);

      if (!products.length) {
        break;
      }

      for (const product of products) {
        await this.requestAdditionalImagesForProduct(product, imageType);
      }
      processedProductsCount += products.length;
      pagination.page++;
    }

    this.logger.log(processedProductsCount + ' products was processed');
  }

  private async requestAdditionalImagesForProduct(
    product: ProductModel,
    imageType: MediaAdditionalImageTypesEnum,
  ): Promise<void> {
    if (!product.images) {
      return;
    }

    const promises: Array<Promise<any>> = [];
    for (const image of product.images) {
      promises.push(this.publisher.publishAdditionalImageRequested(image, MediaContainersEnum.Products, imageType));
    }

    await Promise.all(promises);
  }
}
