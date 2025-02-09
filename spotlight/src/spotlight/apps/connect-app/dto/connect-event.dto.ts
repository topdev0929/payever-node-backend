import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IntegrationSubscriptionDto } from './integration-subscription.dto';

export class ConnectEventDto {

  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @Type(() => IntegrationSubscriptionDto)
  @ValidateNested()
  public integrationSubscription: IntegrationSubscriptionDto;
}
