import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

@Exclude()
export class OrderCartItemAttributesDimensionsIncomingDto {
  @ApiProperty()
  @IsNumber()
  @Expose()
  public height?: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  public width?: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  public length?: number;
}
