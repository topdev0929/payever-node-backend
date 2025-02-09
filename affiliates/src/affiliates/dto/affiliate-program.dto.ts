import { IsArray, IsEnum, IsNumber, IsDateString, IsOptional, IsString } from 'class-validator';
import { CommissionTypeEnum, AffiliateStatusEnum, AppliesToEnum } from '../enums';
import { AffiliateCommissionModel, ProductModel } from '../models';
import { ApiProperty } from '@nestjs/swagger';

export class AffiliateProgramDto {
  @ApiProperty()
  @IsNumber()
  public assets: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public affiliateBranding: string;

  @ApiProperty()
  @IsString()
  public appliesTo: AppliesToEnum;

  @ApiProperty()
  @IsArray()
  public categories: string[];

  @ApiProperty()
  @IsArray()
  public commission: AffiliateCommissionModel[];
  
  @ApiProperty()
  @IsEnum(CommissionTypeEnum)
  public commissionType: CommissionTypeEnum;
  
  @ApiProperty()
  @IsNumber()
  public cookie: number;
  
  @ApiProperty()
  @IsString()
  public currency: string;

  @ApiProperty()
  @IsNumber()
  public defaultCommission: number;
  
  @ApiProperty()
  @IsString()
  public inviteLink: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  public parentFolderId: string;
  
  @ApiProperty()
  @IsDateString()
  public startedAt: Date;
  
  @ApiProperty()
  @IsString()
  public name: string;
  
  @ApiProperty()
  @IsArray()
  public products: ProductModel[];
  
  @ApiProperty()
  @IsString()
  public programApi: string;
  
  @ApiProperty()
  @IsEnum(AffiliateStatusEnum)
  public status: AffiliateStatusEnum;
  
  @ApiProperty()
  @IsString()
  public url: string;
}
