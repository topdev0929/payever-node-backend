import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetStocksBySkusDto {
  @ApiProperty()
  @IsNotEmpty()
  public skus: string[];
}
