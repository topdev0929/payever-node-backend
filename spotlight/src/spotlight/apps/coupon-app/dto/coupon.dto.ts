import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { CouponsStatusEnum, CouponTypeEnum } from '../enums';

export class CouponDto {
  
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @IsOptional()
  @IsString()
  public businessId: string;

  @IsString()
  @IsOptional()
  public name: string;

  @IsOptional()
  @IsString()
  public code: string;

  @IsOptional()
  @IsString()
  public description: string;

  @IsOptional()
  public endDate: Date;

  @IsOptional()
  @IsBoolean()
  public isAutomaticDiscount: boolean;

  @IsOptional()
  public startDate: Date;

  @IsOptional()
  public status: CouponsStatusEnum;

  @IsOptional()
  public type: {
    type: CouponTypeEnum;
  };
}
