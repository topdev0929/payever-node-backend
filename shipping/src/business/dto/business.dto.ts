import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { BusinessDto as KitBusinessDto } from '@pe/business-kit';
import { ShippingSettingInterface } from '../../shipping/interfaces';

export class BusinessDto extends KitBusinessDto {
  @ApiProperty()
  @IsOptional()
  public settings?: ShippingSettingInterface[];
}
