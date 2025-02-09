import { IsDefined, IsString, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessDto } from '../';
import { ThirdPartyNameReferenceDto } from '../third-party-name-reference.dto';

export class ThirdPartyDisconnectedMessageDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => BusinessDto)
  public business: BusinessDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => ThirdPartyNameReferenceDto)
  public integration: ThirdPartyNameReferenceDto;
}
