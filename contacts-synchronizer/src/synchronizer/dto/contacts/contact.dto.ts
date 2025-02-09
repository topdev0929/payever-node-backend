import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ImportedItemTypesEnum } from '@pe/synchronizer-kit';

export class ContactDto {
  @IsString()
  @IsOptional()
  public type: ImportedItemTypesEnum;

  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsString()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsOptional()
  public company: string;

  @IsString()
  @IsOptional()
  public addressOne: string;
  
  @IsString()
  @IsOptional()
  public addressTwo: string;
  
  @IsString()
  @IsOptional()
  public city: string;
  
  @IsString()
  @IsOptional()
  public province: string;
  
  @IsString()
  @IsOptional()
  public provinceCode: string;
  
  @IsString()
  @IsOptional()
  public country: string;
  
  @IsString()
  @IsOptional()
  public countryCode: string;
  
  @IsString()
  @IsOptional()
  public zip: string;
  
  @IsString()
  @IsOptional()
  public phone: string;
  
  @IsBoolean()
  @IsOptional()
  public acceptsMarketing: boolean;

  @IsString()
  @IsOptional()
  public totalSpent: string;
  
  @IsString()
  @IsOptional()
  public totalOrders: string;

  @IsString()
  @IsOptional()
  public tags: string;

  @IsString()
  @IsOptional()
  public note: string;

  @IsBoolean()
  @IsOptional()
  public taxExempt: boolean;
}
