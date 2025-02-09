import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { OriginalInventoryDto } from './original-inventory.dto';
import { CreateInventoryDto } from '.';

export class AadminInventoryDto extends CreateInventoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessId: string;
}
