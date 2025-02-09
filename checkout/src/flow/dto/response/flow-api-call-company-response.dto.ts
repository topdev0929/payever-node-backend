import { CompanyTypeEnum } from '../../../legacy-api/enum';

export class FlowApiCallCompanyResponseDto {
  public type?: CompanyTypeEnum;
  public name?: string;
  public registrationNumber?: string;
  public registrationLocation?: string;
  public taxId?: string;
  public homepage?: string;
  public externalId?: string;
}
