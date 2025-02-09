import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsDefined } from 'class-validator';

export class CheckoutEventDto {
  @IsString()
  @IsNotEmpty()
  public checkoutId: string;

  @IsString()
  @IsOptional()
  public businessId: string;

  @IsBoolean()
  @IsDefined()
  public default: boolean;

  @IsString()
  @IsOptional()
  public linkChannelSetId: string;

  @IsString()
  @IsOptional()
  public name: string;
}

