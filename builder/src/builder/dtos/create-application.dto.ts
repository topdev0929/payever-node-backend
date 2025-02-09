import { IsDefined, IsNotEmpty, IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessReferenceDto } from './business-reference.dto';
import { AffiliateReferenceDto } from './affiliate-reference.dto';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @ValidateNested()
  @IsDefined()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => AffiliateReferenceDto)
  public affiliate: AffiliateReferenceDto;

  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  @IsOptional()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public type: string;
}
