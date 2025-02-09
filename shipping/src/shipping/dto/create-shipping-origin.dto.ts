import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDefined, IsOptional } from 'class-validator';
import { ShippingOriginInterface } from '../interfaces';
import { LocalDeliveryDto } from './local-delivery.dto';
import { LocalPickUpDto } from './local-pick-up.dto';

export class CreateShippingOriginDto implements ShippingOriginInterface {
  @ApiPropertyOptional()
  @IsOptional()
  public isDefault: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public localDelivery?: LocalDeliveryDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public localPickUp?: LocalPickUpDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  public streetName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public streetNumber: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  public city: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public stateProvinceCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  public zipCode: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  public countryCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public phone: string;
}
