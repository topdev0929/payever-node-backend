import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ProductCategoryDto } from './product-category.dto';
import { ProductVariantsDto } from './product-variants.dto';
import { ProductShippingDto } from './product-shipping.dto';
import { ProductTypeEnum, ProductConditionEnum } from '../enums';
import { ProductMarketplaceDto } from './product-marketplace.dto';
import { IsBusinessCategory, IsCollection } from '../../categories/constraints';
import { ProductChannelSetDto } from './product-channel-set.dto';
import { OptionDto } from './option.dto';
import { ProductAttributeDto } from './product-attribute.dto';
import { VariationAttributeDto } from './variation-attribute.dto';
import { ProductRecommendationDto } from './product-recommendation.dto';
import { ProductPriceDto } from './product-price.dto';
import { ProductSeoDto } from './product-seo.dto';
import { ProductDeliveryDto } from './product-delivery.dto';
import { ProductSaleDto } from './product-sale.dto';
import { ProductChannelSetCategoriesDto } from './product-channel-set-categories.dto';
import { ProductInventoryDto } from './product-inventory.dto';

export class ProductDto {
  @IsOptional()
  @IsUUID()
  public businessId?: string;

  @IsUUID()
  public businessUuid: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductChannelSetDto)
  public channelSets?: ProductChannelSetDto[];

  @IsOptional()
  @IsString()
  public currency?: string;

  @IsOptional()
  @IsString()
  public company?: string;

  @IsArray()
  @IsString({
      each: true,
  })
  public images: string[];

  @IsOptional()
  @IsArray()
  @IsUrl({ }, {
    each: true,
  })
  public imagesUrl?: string[];

  @IsOptional()
  @IsArray()
  @IsString({
      each: true,
  })
  public videos?: string[];

  @IsOptional()
  @IsArray()
  @IsUrl({ }, {
    each: true,
  })
  public videosUrl?: string[];

  @IsString()
  public title: string;

  @IsOptional()
  @IsString()
  public brand?: string;

  @IsOptional()
  @IsEnum(ProductConditionEnum)
  public condition?: ProductConditionEnum = ProductConditionEnum.new;

  @IsString()
  public description: string;

  @IsNumber()
  public price: number;

  @IsNumber()
  @IsOptional()
  public vatRate?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductPriceDto)
  public priceTable?: ProductPriceDto[];

  @IsOptional()
  @IsString()
  public country?: string;

  @IsOptional()
  @IsString()
  public language?: string;

  @IsOptional()
  @Type(() => ProductSaleDto)
  public sale?: ProductSaleDto;

  @IsOptional()
  @IsString()
  public sku?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductSeoDto)
  public seo?: ProductSeoDto;

  @IsOptional()
  @IsString()
  public barcode?: string;

  @IsOptional()
  @IsString()
  public origin?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductCategoryDto)
  public categories: ProductCategoryDto[];

  @IsOptional()
  channelSetCategories?: ProductChannelSetCategoriesDto[];

  @IsOptional()
  @IsBusinessCategory('businessUuid')
  public category?: string;

  @IsOptional()
  @IsCollection('businessUuid', { each: true })
  public collections?: string[];

  @IsEnum(ProductTypeEnum)
  public type: ProductTypeEnum;

  @IsOptional()
  @IsString()
  public id?: string;

  @IsOptional()
  @IsString()
  public importedId?: string;

  @IsBoolean()
  public active: boolean;

  @IsBoolean()
  @IsOptional()
  public example?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantsDto)
  @IsOptional()
  public variants?: ProductVariantsDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ProductShippingDto)
  public shipping?: ProductShippingDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDeliveryDto)
  @IsOptional()
  public deliveries?: ProductDeliveryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductMarketplaceDto)
  @IsOptional()
  public marketplaces?: ProductMarketplaceDto[];

  /** @deprecated: Remove after attributes are deployed */
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  public options?: OptionDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ProductRecommendationDto)
  public recommendations?: ProductRecommendationDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  public attributes?: ProductAttributeDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VariationAttributeDto)
  public variantAttributes?: VariationAttributeDto[];

  @IsOptional()
  @IsString()
  public ean?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProductInventoryDto)
  public inventory?: ProductInventoryDto;
}
