import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ElasticProductEnum } from '../enums';
import { FilterDto } from '../dto/filter.dto';
import { PaginationDto, SortDto } from '../dto';
import { ElasticProductsQueryBuilderHelper } from '../helpers';
import { Model } from 'mongoose';
import { ProductsPaginatedInterface, ProductVariantInterface } from '../interfaces';
import {
  isObjectAProductModel,
  PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  PopulatedVariantsProductModel,
  PopulatedVariantsCollectionsProductModel,
  ProductModel,
} from '../models';
import { ElasticProductConverter } from '../converters';
import {
  ElasticSearchClient,
  ElasticSearchExpressionsEnum,
  ElasticSearchQueryBuilder,
  ExpressionsFactory,
} from '@pe/elastic-kit';
import { CategoryService } from '../../categories/services';
import { ProductService } from './product.service';
import { BusinessModel } from '../../business/models';
import { BusinessService } from '../../business/services';
import { ProductDocumentLikeDto } from '../../bus/product-export-bus.dto';
import { FIX_MISTYPING, FORCE_POPULATION_TYPE } from 'src/special-types';

@Injectable()
export class ProductsElasticService {

  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
    @InjectModel('Product') private readonly products: Model<ProductModel>,
    private readonly logger: Logger,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
    private readonly businessService: BusinessService,
  ) { }

  public async getAvailableAttributes(filters: any, businessId: string): Promise<any> {
    const queryBuilder: ElasticSearchQueryBuilder = ElasticProductsQueryBuilderHelper.createBuilderForBusiness(
      filters,
      businessId,
      true,
    );
    queryBuilder
      .size(0)
      .selectFields([]);

    const body: any = {
      ...queryBuilder.getRequest(),
      ...{
        aggs: {
          attributes: {
            aggs: {
              attributeName: {
                aggs: {
                  attributeValue: {
                    terms: { field: 'attributes.value' },
                  },
                },
                terms: { field: 'attributes.name'},
              },
            },
            nested: {
              path: 'attributes',
            },
          },
        },
      },
    };

    return this.elasticSearchClient.search(ElasticProductEnum.index, body)
      .then((results: any) => {
        return results.body.aggregations.attributes.attributeName.buckets.map(
          (attribute: any) => {
            return {
              name: attribute.key,
              values: attribute.attributeValue.buckets.map((value: any) => value.key),
            };
          },
        );
      });
  }

  public async searchProducts(
    businessId: string,
    sort: SortDto,
    pagination: PaginationDto,
    filter: FilterDto = { },
  ): Promise<ProductsPaginatedInterface<PopulatedVariantsCollectionsProductModel>> {
    const searchResult: any = await this.selectIdentifiersByFilter(filter, businessId, pagination, sort);
    let products: PopulatedVariantsCollectionsProductModel[] =
      (await this.products
        .find({ _id: { $in: searchResult.identifiers }})
        .populate('variants')
        .populate('collections')) as FORCE_POPULATION_TYPE;

    const skus: string[] = products.map((p: PopulatedVariantsCollectionsProductModel) => p.sku);
    let stocks: { [key: string]: number } = { };
    try {
      stocks = await this.productService.getInventoriesStocks(businessId, skus);
    } catch (e) {
      this.logger.log('failed to get stock');
    }

    const business: BusinessModel = await this.businessService.getById(businessId);

    products = await Promise.all(products.map(async (p: PopulatedVariantsCollectionsProductModel) => {
      p.stock = stocks[p.sku];
      p.category = await this.categoryService.getByIdAndBusiness(p.category, p.businessId) as FIX_MISTYPING;
      p.variantCount = p.variants.length;

      p.business = {
        _id: p.businessId,
        companyAddress: business?.companyAddress,
      };

      return p;
    }));

    return {
      info: {
        pagination: {
          item_count: searchResult.total.value,
          page: pagination.page,
          page_count: Math.ceil(searchResult.total / pagination.limit),
          per_page: pagination.limit,
        },
      },
      products: this.sortByIdentifiers(products, searchResult.identifiers),
    };
  }

  // TODO: es cannot sort somehow on title
  public async  searchProductForBuilder(
    filter: string,
    order: string = '',
    pagination: PaginationDto = { limit: 0, page: 1 },
  ): Promise<any> {
    const filterData: any = JSON.parse(filter);
    const query: any = { };
    if (!filterData.business) {
      return;
    }
    if (filterData.title) {
      query.title = {
        $options: 'i',
        $regex: `(.+)?${filterData.title}(.+)?`,
      };
    }

    const businessId: string = filterData.business;
    const filterES: any = {
      ...filterData,
    };
    delete filterES.business;

    let orderData: any = { };
    if (order) {
      orderData = JSON.parse(order);
    }
    const data: ProductsPaginatedInterface<PopulatedVariantsCollectionsProductModel> =
      await this.searchProducts(businessId, orderData, pagination, filterES);
    const countData: any = data.info.pagination.item_count;

    return {
      result: data.products,
      totalCount: countData.value,
    };
  }

  public async indexProductsByIds(ids: string[]): Promise<void> {
    const products: ProductModel[] = await this.products.find({
      _id: { $in: ids },
    });

    const promise: Array<Promise<void>> = [];

    for (const product of products) {
      promise.push(this.saveIndex(product));
    }

    await Promise.all(promise);
  }

  public async indexingSlug(
    data: FIX_MISTYPING,
  ): Promise<void> {
    await this.elasticSearchClient.singleIndex(
      ElasticProductEnum.index,
      data,
    );
  }

  public async saveIndex(
    product: ProductModel | ProductDocumentLikeDto | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): Promise<void> {
    await this.elasticSearchClient.singleIndex(
      ElasticProductEnum.index,
      ElasticProductConverter.productToElastic(product),
    );
    if (isObjectAProductModel(product) && product.variants?.length > 0) {
      const variantsBatch: ProductVariantInterface[] = [];
      if (typeof product.variants[0] === 'string') {
        await product.populate('variants').execPopulate();
      }
      for (const variant of product.variants) {
        if (typeof variant === 'string') { continue; }
        variantsBatch.push(ElasticProductConverter.variantToElastic(variant));
      }

      await this.elasticSearchClient.bulkIndex(
        ElasticProductEnum.index,
        variantsBatch,
        product.id,
      );
    }
  }

  public async deleteIndex(
    product: ProductModel | ProductDocumentLikeDto | PopulatedVariantsProductModel,
  ): Promise<void> {
    await this.elasticSearchClient.deleteByQuery(
      ElasticProductEnum.index,
      {
        query: {
          match_phrase: {
            mongoId: product.id,
          },
        },
      },
    );

    await this.elasticSearchClient.deleteByQuery(
      ElasticProductEnum.index,
      {
        query: {
          match_phrase: {
            product: product.id,
          },
        },
      },
    );
  }

  public async getProductsIdentifiers(
    filter: FilterDto,
    businessId: string,
    strictFilters: boolean,
  ): Promise<string[]> {
    const identifiers: any = await this.selectIdentifiersByFilter(filter, businessId, null, null, strictFilters);

    return identifiers.identifiers;
  }

  public async searchBuilderProducts(
    business: string,
    search: string,
    offset: number = 0,
    limit: number = 20,
  ): Promise<any> {
    /* tslint:disable:object-literal-sort-keys */
    const queryEs: any = {
      'query': {
        'bool': {
          'must': [
            {
              bool: {
                should: [
                  { match_phrase_prefix: { title: search } },
                  { match_phrase_prefix: { title: search } },
                  { match_phrase_prefix: { description: search } },
                  { match_phrase_prefix: { 'options.value': search } },
                  { match_phrase_prefix: { 'collections.name': search } },
                  { match_phrase_prefix: { 'collections.description': search } },
                  { match_phrase_prefix: { 'attributes.name': search } },
                  { match_phrase_prefix: { 'attributes.value': search } },
                  { match_phrase_prefix: { 'category.title': search } },
                  { match_phrase_prefix: { 'category.name': search } },
                  { match_phrase_prefix: { barcode: search } },
                  { match_phrase_prefix: { sku: search } },
                ],
              },
            },
            {
              'match_phrase': {
                'businessUuid': business,
              },
            },
          ],
        },
      },
      highlight: {
        pre_tags: [''],
        post_tags: [''],
        fields: {
          title: { },
          description: { },
          'options.value': { },
          'collections.name': { },
          'collections.description': { },
          'attributes.name': { },
          'attributes.value': { },
          'category.title': { },
          'category.name': { },
          barcode: { },
          sku: { },
        },
      },
    };
    queryEs.from = offset;
    queryEs.size = limit;

    const result: any = await this.elasticSearchClient.search(
      ElasticProductEnum.index,
      queryEs,
    );
    const products: any[] = result.body.hits.hits.map((data: any) => {
      const priceAndCurrency: string = data._source.currency && data._source.price ?
        `${data._source.currency} ${data._source.price}` : null;
      const salePriceAndCurrency: string = data._source.currency && data._source.salePrice ?
        `${data._source.currency} ${data._source.salePrice}` : null;

      let matchedText: string = '';
      for (const field in data.highlight) {
        if (data.highlight.hasOwnProperty(field)) {
          matchedText = data.highlight[field][0];
          break;
        }
      }

      return {
        ...data._source,
        id: data._source.uuid,
        matchedText: matchedText,
        priceAndCurrency: priceAndCurrency,
        salePriceAndCurrency: salePriceAndCurrency,
      };
    });

    return {
      result: products,
      totalCount: result.body.hits.total.value,
    };
  }

  private async selectIdentifiersByFilter(
    filter: FilterDto,
    businessId: string,
    pagination?: PaginationDto,
    sort?: SortDto,
    strictFilters: boolean = false,
  ): Promise<{ total: number; identifiers: string[] }> {
    strictFilters = strictFilters !== false;
    const queryBuilder: ElasticSearchQueryBuilder = this.createQueryBuilder(filter, businessId, strictFilters);

    if (sort && sort.field) {
      queryBuilder.addSort(sort.field, sort.direction);
    }

    queryBuilder
      .selectFields([]);

    if (pagination) {
      const page: number = (pagination.page > 0) ? pagination.page - 1 : 1;
      queryBuilder
        .size(pagination.limit)
        .offset(page * pagination.limit);
    }

    return this.elasticSearchClient.search(
      ElasticProductEnum.index,
      queryBuilder.getRequest(),
    )
      .then((results: any) => {
        return {
          identifiers: results.body.hits.hits.map((item: any) => item._id),
          total: results.body.hits.total,
        };
      });
  }

  private createQueryBuilder(
    filter: FilterDto,
    businessId: string,
    strictFilters: boolean,
  ): ElasticSearchQueryBuilder {
    const { search, filters, excludeIds, includeIds }: any = filter;
    const queryBuilder: ElasticSearchQueryBuilder =
      ElasticProductsQueryBuilderHelper.createBuilderForBusiness(filters, businessId, strictFilters);

    if (excludeIds) {
      excludeIds.forEach((id: string) => {
        queryBuilder.mustNot(ExpressionsFactory.getExpression('mongoId', id, ElasticSearchExpressionsEnum.Match));
      });
    }

    if (includeIds) {
      includeIds.forEach((id: string) => {
        queryBuilder.must(ExpressionsFactory.getExpression('mongoId', id, ElasticSearchExpressionsEnum.Match));
      });
    }

    if (search) {
      queryBuilder.must(ExpressionsFactory.getExpression('title', search, ElasticSearchExpressionsEnum.Contains));
    }

    return queryBuilder;
  }

  private sortByIdentifiers(
    products: PopulatedVariantsCollectionsProductModel[],
    identifiers: string[],
  ): PopulatedVariantsCollectionsProductModel[] {
    const sorted: PopulatedVariantsCollectionsProductModel[] = [];
    for (const id of identifiers) {
      sorted.push(products.find((product: PopulatedVariantsCollectionsProductModel) => product.id === id));
    }

    return sorted;
  }
}
