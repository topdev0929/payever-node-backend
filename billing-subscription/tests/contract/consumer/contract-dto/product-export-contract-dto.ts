import { BusinessInterface } from '../../../../src/business';
import { ProductExportedDto } from '../../../../src/subscriptions/dto';
import { CategoryInterface } from '../../../../src/subscriptions/interfaces/entities';

export class ProductExportedContractDto implements ProductExportedDto {
  public _id: string;
  public business?: BusinessInterface;
  public businessId: string;
  public price: number;
  public title: string;
  public image: string;
  public apps?: [string];
  public active?: boolean;
  public album?: string;
  public barcode?: string;
  public businessUuid?: string;
  public categories?: [CategoryInterface];
  public category?: CategoryInterface;
  public collections?: [string];
  public channelSets?: [string];
  public country?: string;
  public currency?: string;
  public description?: string;
  public images?: [string];
  public imagesUrl?: [string];
  public salePrice?: number;
  public shipping?: any;
  public slug?: string;
  public sku?: string;
  public type?: string;
  public variants?: [string];
  public vatRate?: number;
  public example?: boolean;
  public attributes?: [any];
  public variantAttributes?: [any];
  public videos?: [string];
  public videosUrl?: [string];
}
