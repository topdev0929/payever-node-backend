import { FlowApiCallShippingOptionDetailsResponseDto } from './flow-api-call-shipping-option-details-response.dto';
import { ShippingOptionCategoryEnum } from '../../../legacy-api/enum';

export class FlowApiCallShippingOptionResponseDto {
  public name?: string;
  public carrier?: string;
  public category?: ShippingOptionCategoryEnum;
  public price?: number;
  public taxRate?: number;
  public taxAmount?: number;
  public details?: FlowApiCallShippingOptionDetailsResponseDto;
}
