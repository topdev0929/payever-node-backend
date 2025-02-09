import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { BusinessDto } from '../';
import { ThirdPartyNameReferenceDto } from '../third-party-name-reference.dto';

export class ThirdPartyConnectedMessageDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => BusinessDto )
  public business: BusinessDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => ThirdPartyNameReferenceDto )
  public integration: ThirdPartyNameReferenceDto;
}
