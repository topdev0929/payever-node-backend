import { ApiProperty } from '@nestjs/swagger';

import {
  CouponTypeAppliedToEnum,
} from '../enum';

export class AppliesToResponseDto {
  @ApiProperty()
  public appliesTo: CouponTypeAppliedToEnum;

  @ApiProperty()
  public appliesToCategories: string[];

  @ApiProperty()
  public appliesToProducts: string[];
}
