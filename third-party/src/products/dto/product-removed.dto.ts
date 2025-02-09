import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProductRemovedDto {
  @ApiProperty()
  @IsString()
  public sku: string;
}
