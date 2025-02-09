import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { PurchaserTypesEnum } from '../../../../../enum';
import { OnboardPurchaserRequestDto } from './onboard-purchaser-request.dto';

@Exclude()
export class UpdatePurchaserRequestDto extends OnboardPurchaserRequestDto {
  @Expose()
  @IsOptional()
  @IsEmail()
  public email: string;

  @Expose()
  @IsOptional()
  @IsEnum(PurchaserTypesEnum)
  public type: PurchaserTypesEnum;
}
