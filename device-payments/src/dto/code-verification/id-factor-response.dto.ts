import { ApiResponseProperty } from '@nestjs/swagger';

import { CodeStatus } from '../../enum';
import { CodeVerificationResponseInterface } from '../../interfaces';

export class IdFactorResponseDto implements CodeVerificationResponseInterface {
  @ApiResponseProperty()
  public firstName: string;

  @ApiResponseProperty()
  public lastName: string;

  @ApiResponseProperty()
  public email: string;

  @ApiResponseProperty()
  public amount: number;

  @ApiResponseProperty()
  public address: {
    street_number?: string;
    post_code?: string;
    city?: string;
    country: string;
  };

  @ApiResponseProperty()
  public status: CodeStatus;

  @ApiResponseProperty()
  public payment_method: string;

  @ApiResponseProperty()
  public payment_id: string;
}
