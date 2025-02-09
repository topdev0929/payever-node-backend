import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectIntegrationSubscriptionDeleteEventDto {
  @IsString()
  @IsNotEmpty()
  public integrationSubscription: string;
}
