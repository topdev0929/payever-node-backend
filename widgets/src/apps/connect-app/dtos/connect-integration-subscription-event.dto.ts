import { IsNotEmpty, IsString } from 'class-validator';
import { ConnectIntegrationInterface } from '../interfaces';

export class ConnectIntegrationSubscriptionEventDto {
  @IsString()
  @IsNotEmpty()
  public business: string;

  @IsString()
  @IsNotEmpty()
  public integrationSubscription: {
    _id: string;
    installed: boolean;
    integration: ConnectIntegrationInterface;
  };
}
