import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

import { IsGreaterThan } from '../../decorators';
import { RangeInterface } from '../../interfaces';

export class RangeDto implements RangeInterface {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public min?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsGreaterThan('min', { message: 'Value must be greater than min' })
  public max?: number;
}
