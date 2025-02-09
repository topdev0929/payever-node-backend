import { ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessDto } from '../';
import { IntegrationNameReferenceDto } from '../integration-name-reference.dto';
import { ProductSkuReferenceDto } from '../products';

export class ThirdPartyProductRemovedMessageDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => BusinessDto)
  public business: BusinessDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => IntegrationNameReferenceDto)
  public integration: IntegrationNameReferenceDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => ProductSkuReferenceDto)
  public data: ProductSkuReferenceDto;
}
