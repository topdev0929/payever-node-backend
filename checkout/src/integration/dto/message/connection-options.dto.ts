import { IsArray, IsBoolean, IsOptional } from 'class-validator';

export class ConnectionOptionsDto {
  @IsOptional()
  @IsBoolean()
  public default?: boolean;

  @IsOptional()
  @IsBoolean()
  public merchantCoversFee?: boolean;

  @IsOptional()
  @IsBoolean()
  public shopRedirectEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  public shippingAddressEquality?: boolean;

  @IsOptional()
  @IsBoolean()
  public isEmailNotificationAllowed?: boolean;

  @IsOptional()
  @IsBoolean()
  public isAutoCaptureEnabled?: boolean;

  @IsOptional()
  @IsArray()
  public countryLimits?: string[];
}
