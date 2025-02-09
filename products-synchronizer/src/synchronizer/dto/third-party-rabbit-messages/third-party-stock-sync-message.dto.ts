import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { BusinessDto } from '../';
import { IntegrationNameReferenceDto } from '../integration-name-reference.dto';
import { ThirdPartyInventoryDto } from './third-party-inventory.dto';

export class ThirdPartyStockSyncMessageDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => BusinessDto)
  public business: BusinessDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => IntegrationNameReferenceDto)
  public integration: IntegrationNameReferenceDto;

  @IsDefined()
  public inventories: ThirdPartyInventoryDto | ThirdPartyInventoryDto[];

}
