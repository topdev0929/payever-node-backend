import { Injectable } from '@nestjs/common';

import { ElasticSearchClient } from '@pe/elastic-kit';
import {
  FolderDocument,
  FoldersService,
  FolderModelService,
  ListQueryDto,
  ScopeEnum,
} from '@pe/folders-plugin';
import { BusinessModel } from '../../business';
import { ElasticProductEnum } from '../../products/enums';
import { ProductModel } from '../../products/models';
import { ProductService } from '../../products/services';

@Injectable()
export class ProductFolderDocumentsService {
  constructor(
    private readonly foldersService: FoldersService,
    private readonly folderModelService: FolderModelService,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly productService: ProductService,
  ) { }

  public async getDefaultFolder(): Promise<FolderDocument[]> {
    return this.folderModelService.getFolders({ scope: ScopeEnum.Default });
  }

  public async searchForDropshippingProducts(
    business: BusinessModel,
    listDto: ListQueryDto,
  ): Promise<any> {
    const queryEs: any = {
      query: {
        bool: {
          must: [
            {
              exists: {
                field: 'dropshipping',
              },
            },
            {
              match_phrase: {
                dropshipping: true,
              },
            },
          ],
        },
      },
    };
    const searchQueryEs: any = {
      ...queryEs,
      from: listDto.paging.limit * (listDto.paging.page - 1),
      size: listDto.paging.limit,
    };

    const result: any = await this.elasticSearchClient.search(
      ElasticProductEnum.index,
      searchQueryEs,
    );

    const products: any[] = result.body.hits.hits.map((data: any) => {
      return data._source;
    });

    const countResult: any = await this.elasticSearchClient.count(ElasticProductEnum.index, queryEs);
    const total: number = countResult?.body?.count ? countResult.body.count : 0;

    // tslint:disable-next-line:prefer-for-of
    for (let i: number = 0; i < products.length; i++) {
      const importedProduct: ProductModel = await this.productService.findOne({
        businessId: business._id,
        importedId: products[i].uuid,
      });

      products[i].importedProduct = importedProduct;
    }

    return {
      collection: products,
      filters: { },
      pagination_data: {
        page: listDto.paging.page,
        total,
      },
      usage: { },
    };
  }

  public async searchForImportedProducts(
    business: BusinessModel,
    listDto: ListQueryDto,
  ): Promise<any> {
    const queryEs: any = {
      query: {
        bool: {
          must: [
            {
              exists: {
                field: 'importedId',
              },
            },
            {
              match_phrase: {
                businessId: business._id,
              },
            },
          ],
        },
      },
    };
    const searchQueryEs: any = {
      ...queryEs,
      from: listDto.paging.limit * (listDto.paging.page - 1),
      size: listDto.paging.limit,
    };

    const result: any = await this.elasticSearchClient.search(
      ElasticProductEnum.index,
      searchQueryEs,
    );

    const products: any[] = result.body.hits.hits.map((data: any) => {
      return data._source;
    });

    const countResult: any = await this.elasticSearchClient.count(ElasticProductEnum.index, queryEs);
    const total: number = countResult?.body?.count ? countResult.body.count : 0;

    return {
      collection: products,
      filters: { },
      pagination_data: {
        page: listDto.paging.page,
        total,
      },
      usage: { },
    };
  }
}
