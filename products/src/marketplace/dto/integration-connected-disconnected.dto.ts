import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { BusinessMessageDto } from './business-message.dto';
import { IntegrationMessageDto } from './integration-message.dto';
import { Type } from 'class-transformer';

export class IntegrationConnectedDisconnected {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BusinessMessageDto)
  public business: BusinessMessageDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IntegrationMessageDto)
  public integration: IntegrationMessageDto;
}
