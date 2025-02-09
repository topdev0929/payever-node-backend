import { ValidateNested } from 'class-validator';
import { CompanyDetailsDto } from './company-details.dto';
import { BusinessDto as KitBusinessDto } from '@pe/business-kit';

export class BusinessDto extends KitBusinessDto {
  @ValidateNested()
  public companyDetails: CompanyDetailsDto;
}
