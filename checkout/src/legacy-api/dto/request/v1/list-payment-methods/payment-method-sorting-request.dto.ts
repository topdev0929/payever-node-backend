import { PaymentMethodSortingRequestInterface } from '../../../../interfaces';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PaymentMethodSortingRequestDto implements PaymentMethodSortingRequestInterface{
  @ApiPropertyOptional()
  @IsString()
  public direction: string;
}
