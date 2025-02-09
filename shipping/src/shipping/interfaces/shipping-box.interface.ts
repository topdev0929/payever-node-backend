import { BusinessInterface } from '../../business';
import { IntegrationInterface } from '../../integration';
import { BoxTypesEnums, CreatedByEnum, DimensionUnitEnums, WeightUnitEnums } from '../enums';
import { BoxKindsEnums } from '../enums/box-kind.enum';

export interface ShippingBoxInterface {
  name?: string;
  dimensionUnit?: DimensionUnitEnums;
  weightUnit?: WeightUnitEnums;
  type?: string;
  kind?: BoxKindsEnums;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  isDefault?: boolean;
  integration?: IntegrationInterface | string;
  business?: BusinessInterface | string;
  businessId?: string;
  createdBy?: CreatedByEnum;
}
