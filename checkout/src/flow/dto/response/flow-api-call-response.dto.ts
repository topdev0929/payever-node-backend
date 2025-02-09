import { FlowAddressResponseDto } from './flow-address-response.dto';
import { CustomerTypeEnum } from '../../../common/enum';
import { FlowApiCallCompanyResponseDto } from './flow-api-call-company-response.dto';
import { FlowApiCallShippingOptionResponseDto } from './flow-api-call-shipping-option-response.dto';
import { FlowApiCallSplitResponseDto } from './flow-api-call-split-response.dto';

export class FlowApiCallResponseDto {
  public id: string;
  public birthDate: Date;
  public billingAddress?: FlowAddressResponseDto;
  public shippingAddress?: FlowAddressResponseDto;
  public cancelUrl?: string;
  public skipHandlePaymentFee?: boolean;

  public referenceExtra?: string;
  public purchaseCountry?: string;
  public customerType?: CustomerTypeEnum;
  public customerGender?: string;
  public company?: FlowApiCallCompanyResponseDto;
  public organizationName?: string;
  public houseExtension?: string;
  public shippingOption?: FlowApiCallShippingOptionResponseDto;
  public splits?: FlowApiCallSplitResponseDto[];
  public allowSeparateShippingAddress?: boolean;
  public allowCustomerTypes?: CustomerTypeEnum[];
  public allowBillingStep?: boolean;
  public allowShippingStep?: boolean;
  public useStyles?: boolean;
  public salutationMandatory?: boolean;
  public phoneMandatory?: boolean;
  public birthdateMandatory?: boolean;
  public autoCaptureEnabled?: boolean;
  public autoCaptureDate?: Date;
  public testMode?: boolean;
}
