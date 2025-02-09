import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum , IsString, IsOptional } from 'class-validator';
import { PickupTimeEnums } from '../enums';
import { ShippingOriginInterface } from '../interfaces';
import { LocalPickUpInterface } from '../interfaces/local-pick-up.interface';

export class LocalPickUpDto implements LocalPickUpInterface {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  public shippingOrigin: ShippingOriginInterface | string;
  
  @ApiProperty()
  @IsOptional()
  @IsEnum(PickupTimeEnums)
  public pickUpTime?: PickupTimeEnums;


  @ApiProperty()
  @IsString()
  public pickUpMessage?: string;
}
