import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateCouponDto } from '.';

export class AdminCreateCouponDto extends CreateCouponDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public businessId: string;
}
