import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class IntegrationSubscriptionDto{
  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public category: string;

  @IsNotEmpty()
  @IsBoolean()
  public installed: boolean;
}
