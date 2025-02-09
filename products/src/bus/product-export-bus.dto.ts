
export class ProductExportBusDTO {
  public id: string;
  public businessId: string;
  public businessUuid: string;
  public parent: string;

  public active: boolean;
  public barcode: string;
  public description: string;
  public title: string;
  public type: string;
  public sku: string;

  public images: string[];
  public imagesUrl: string[];

  public price: number;
  public sale: any;

  /** @deprecated */
  public onSales: boolean;
  public salePrice: number;
  public saleEndDate?: string;
  public saleStartDate?: string;

  public country: string;
  public currency: string;
  public vatRate: number;

  public categories: any[];
  public channelSets: any[];
  public inventory?: any;
  public shipping: any;

  public attributes: any[];
  /** @deprecated */
  public options: any;

  /** @deprecated */
  public _id: string;

  /** @deprecated */
  public uuid: string;

  /** @deprecated */
  public hidden: boolean;

  /** @deprecated */
  public enabled: boolean;
}

export type ProductDocumentLikeDto = ProductExportBusDTO & {
  example?: undefined;
  variants?: undefined;
  slug?: string;
  toObject(): ProductDocumentLikeDto;
};
