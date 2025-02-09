import { IsBoolean, IsOptional } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OnboardPurchaserLegalRequestDto {
  @Expose()
  @IsOptional()
  @IsBoolean()
  public utility_bill?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  public has_trading_history?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  public has_trading_history_with_payment_account?: boolean;
}
