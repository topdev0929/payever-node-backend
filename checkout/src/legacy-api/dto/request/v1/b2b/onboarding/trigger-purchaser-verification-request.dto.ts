import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { PurchaserTypesEnum } from '../../../../../enum';
import { OnboardPurchaserRequestDto } from './onboard-purchaser-request.dto';

@Exclude()
export class TriggerPurchaserVerificationRequestDto extends OnboardPurchaserRequestDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  public external_id?: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @Expose()
  @IsOptional()
  @IsString()
  public phone?: string;

  @Expose()
  @IsOptional()
  @IsEnum(PurchaserTypesEnum)
  public type: PurchaserTypesEnum;
}
