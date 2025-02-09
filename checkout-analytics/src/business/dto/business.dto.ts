import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UserAccountDto } from './user-account.dto';
import { CompanyDetailsDto } from './company-details.dto';

export class BusinessDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @ApiProperty()
  @Type(() => UserAccountDto)
  public userAccount: UserAccountDto;

  @ApiProperty()
  @Type(() => CompanyDetailsDto)
  public companyDetails: CompanyDetailsDto;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public logo: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public currency: string;

  @ApiProperty()
  @IsOptional()
  public createdAt: string;

  @ApiProperty()
  @IsOptional()
  public updatedAt: string;
}
