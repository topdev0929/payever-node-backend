import { IsString, ValidateNested, IsDefined, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessDto } from '../';
import { IntegrationNameReferenceDto } from '../integration-name-reference.dto';

export class ThirdPartyStockChangedMessageDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => BusinessDto)
  public business: BusinessDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => IntegrationNameReferenceDto)
  public integration: IntegrationNameReferenceDto;

  @IsString()
  @IsNotEmpty()
  public sku: string;

  @IsNumber()
  public quantity: number;
}
