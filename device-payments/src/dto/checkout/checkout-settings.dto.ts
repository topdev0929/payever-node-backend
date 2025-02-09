import { IsString, IsNumberString } from 'class-validator';

export class CheckoutSettingsDto {
  @IsString()
  public message: string;

  @IsNumberString()
  public phoneNumber: number;

  @IsString()
  public keyword: string;
}
