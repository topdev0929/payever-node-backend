import { ApiResponseProperty } from '@nestjs/swagger';
import { CodeStatus } from '../../enum';
import { CodeVerificationResponseInterface } from '../../interfaces';

export class CodeVerifyResultDto implements CodeVerificationResponseInterface {
  @ApiResponseProperty()
  public amount: number;

  @ApiResponseProperty()
  public status: CodeStatus;

  @ApiResponseProperty()
  public payment_method: string;

  @ApiResponseProperty()
  public payment_id: string;
}
