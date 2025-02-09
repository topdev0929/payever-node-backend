import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FlowAddressInterface } from '../../interfaces';

export class FlowAddressRequestDto implements FlowAddressInterface {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public addressLine2?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public country: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public countryName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public email?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public lastName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public phone?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public salutation?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public street: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public streetName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public streetNumber?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public zipCode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public region?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public organizationName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public houseExtension?: string;
}
