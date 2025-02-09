import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BusinessDto, ConnectionDto, IntegrationDto } from './message';

export class ThirdPartyConnectionChangedDto {
  @IsNotEmpty()
  @Type(() => BusinessDto)
  public business: BusinessDto;

  @IsNotEmpty()
  @Type(() => ConnectionDto)
  public connection: ConnectionDto;

  @IsNotEmpty()
  @Type(() => IntegrationDto)
  public integration: IntegrationDto;
}
