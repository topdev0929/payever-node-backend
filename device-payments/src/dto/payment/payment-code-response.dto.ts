import { ApiResponseProperty } from '@nestjs/swagger';
import { CodeStatus } from '../../enum';

export class PaymentCodeResponseDto {
  @ApiResponseProperty()
  public _id: string;

  @ApiResponseProperty()
  public flow: any;

  @ApiResponseProperty()
  public checkoutId: string;

  @ApiResponseProperty()
  public terminalId: string;

  @ApiResponseProperty()
  public code: number;

  @ApiResponseProperty()
  public status: CodeStatus;

  @ApiResponseProperty()
  public log: any;

  @ApiResponseProperty()
  public sellerEmail?: string;

  @ApiResponseProperty()
  public createdAt: Date;

  @ApiResponseProperty()
  public updatedAt: Date;
}
