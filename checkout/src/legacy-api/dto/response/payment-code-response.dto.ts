import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class PaymentCodeResponseDto {
  @IsString()
  @Expose()
  public apiCallId: string;

  @IsString()
  @Expose()
  public businessId: string;

  @IsNumber()
  @Expose()
  public code: number;
}
