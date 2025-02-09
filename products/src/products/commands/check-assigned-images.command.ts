import { Injectable, Logger } from '@nestjs/common';
import { Command, EventDispatcher } from '@pe/nest-kit';
import { PopulatedVariantsProductModel, ProductModel, ProductModelName, ProductVariantModelName } from '../models';
import { ProductService } from '../services';
import { MediaChangedDto, MediaContainersEnum, MediaEventsEnum } from '@pe/media-sdk';
import { PaginationDto, SortDirectionEnum, SortDto } from '../dto';
import { FORCE_POPULATION_TYPE } from 'src/special-types';

@Injectable()
export class CheckAssignedImagesCommand {
  constructor(
    private readonly productService: ProductService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'media:check-assigned', describe: 'Sends media is assigned message' })
  public async checkAssignedMedia(): Promise<void> {
    const pagination: PaginationDto = {
      limit: 100,
      page: 1,
    };
    const sort: SortDto = {
      direction: SortDirectionEnum.ASC,
      field: 'updatedAt',
    };

    let processedProductsCount: number = 0;
    while (true) {
      const products: PopulatedVariantsProductModel[] = (
        await this.productService.getProductsList({ }, pagination, sort)
      ) as FORCE_POPULATION_TYPE;

      if (!products.length) {
        break;
      }

      for (const product of products) {
        await this.sendMediaAssignedMessage(product);
      }
      processedProductsCount += products.length;
      pagination.page++;
    }

    this.logger.log(processedProductsCount + ' products was processed');
  }

  private async sendMediaAssignedMessage(product: PopulatedVariantsProductModel): Promise<void> {
    if (product.images) {
      const mediaChangedDto: MediaChangedDto = {
        container: MediaContainersEnum.Products,
        originalMediaCollection: [],
        relatedEntity: {
          id: product._id,
          type: ProductModelName,
        },
        updatedMediaCollection: product.images,
      };

      await this.eventDispatcher.dispatch(MediaEventsEnum.MediaChanged, mediaChangedDto);
    }
    if (product.variants) {
      for (const variant of product.variants) {
        const variantMediaChangedDto: MediaChangedDto = {
          container: MediaContainersEnum.Products,
          originalMediaCollection: [],
          relatedEntity: {
            id: variant._id,
            type: ProductVariantModelName,
          },
          updatedMediaCollection: variant.images,
        };

        await this.eventDispatcher.dispatch(MediaEventsEnum.MediaChanged, variantMediaChangedDto);
      }
    }
  }
}
