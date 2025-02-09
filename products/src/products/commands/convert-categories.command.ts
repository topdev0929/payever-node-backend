import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { ProductModel } from '../models';
import { ProductService } from '../services';
import { PaginationDto, SortDirectionEnum, SortDto } from '../dto';
import { OldCategoriesMapperService } from '../../categories/services';
import { CategoryModel } from '../../categories/models';

@Injectable()
export class ConvertCategoriesCommand {
  constructor(
    private readonly productService: ProductService,
    private readonly oldCategoriesMapper: OldCategoriesMapperService,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'categories:convert', describe: 'Converts categories to new structure' })
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
      const products: any[] = await this.productService.getProductsList(
        {
          __t : 'Product',
          categories : { $elemMatch: { _id: { $not: { $regex: /[\w]+-[\w]+-[\w]+-[\w]+-[\w]+/gm } } }},
          channelSets : { $not : { $elemMatch: { id: null }}},
        },
        pagination,
        sort,
      );

      if (!products.length) {
        break;
      }

      for (const product of products) {
        await this.convertCategories(product);
      }
      processedProductsCount += products.length;
    }

    this.logger.log(processedProductsCount + ' products was processed');
  }

  private async convertCategories(product: ProductModel): Promise<void> {
    if (!this.hasCategories(product)) {
      return ;
    }

    const category: CategoryModel[] =
      await this.oldCategoriesMapper.findOrCreateCategory(product.categories, product.businessId);
    const subcategory: CategoryModel =
      await this.oldCategoriesMapper.findOrCreateSubcategory(category[0], product.categories);

    await this.productService.updateCategory(product, subcategory || category[0]);
    await this.productService.updateOldCategories(product, category);
  }

  private hasCategories(product: ProductModel): boolean {
    return product.categories && product.categories.length > 0;
  }
}
