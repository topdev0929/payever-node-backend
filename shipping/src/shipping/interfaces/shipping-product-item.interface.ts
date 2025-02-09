import { WeightUnitEnums, DimensionUnitEnums, CreatedByEnum } from '../enums';

export interface ShippingProductItemInterface {
  readonly uuid: string;
  readonly currency?: string;
  readonly dimensionUnit?: DimensionUnitEnums;
  readonly height: number;
  readonly length: number;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
  readonly sku?: string;
  readonly thumbnail?: string;
  readonly vatRate?: number;
  readonly width: number;
  readonly weight: number;
  readonly weightUnit?: WeightUnitEnums;
  createdBy?: CreatedByEnum;
}
