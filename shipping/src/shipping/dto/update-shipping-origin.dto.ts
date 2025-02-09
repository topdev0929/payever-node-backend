import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsDefined, IsNotEmpty } from 'class-validator';
import { LocalDeliveryDto } from './local-delivery.dto';
import { LocalPickUpDto } from './local-pick-up.dto';

export class UpdateShippingOriginDto {
  @ApiPropertyOptional()
  @IsOptional()
  public isDefault: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  public localDelivery?: LocalDeliveryDto;

  @ApiPropertyOptional()
  @IsOptional()
  public localPickUp?: LocalPickUpDto;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public streetName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public streetNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public city: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public stateProvinceCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public zipCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public countryCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public phone: string;
}
