import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { OnboardPurchaserCustomRequestDto } from './onboard-purchaser-custom-request.dto';
import { PurchaserTypesEnum } from '../../../../../enum';
import { OnboardPurchaserLegalRequestDto } from './onboard-purchaser-legal-request.dto';

@Exclude()
export class OnboardPurchaserRequestDto {
  @Expose()
  @IsOptional()
  @IsString()
  public external_id?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public first_name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public last_name?: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @Expose()
  @IsOptional()
  @IsString()
  public phone?: string;

  @Expose()
  @IsNotEmpty()
  @IsEnum(PurchaserTypesEnum)
  public type: PurchaserTypesEnum;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => OnboardPurchaserCustomRequestDto)
  public custom?: OnboardPurchaserCustomRequestDto;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => OnboardPurchaserLegalRequestDto)
  public legal?: OnboardPurchaserLegalRequestDto;

  @Expose()
  @IsOptional()
  @IsString()
  public notice_url?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public locale?: string;
}
