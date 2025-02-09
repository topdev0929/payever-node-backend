import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductReferenceDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public id: string;
}
