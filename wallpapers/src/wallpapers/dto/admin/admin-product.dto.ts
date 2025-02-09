import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public product_code: string;
}
