import { ValidateNested, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CheckoutSettingsDto } from './checkout-settings.dto';

export class CheckoutSettingUpdateDto {
  @ValidateNested()
  @Type(() => CheckoutSettingsDto)
  public settings: CheckoutSettingsDto;

  @IsString()
  @IsNotEmpty()
  public checkoutId: string;
}
