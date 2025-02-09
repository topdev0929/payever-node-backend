import { IsString, IsNumber } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TopMerchantTransactionsCountDto {
  @IsString()
  @Expose()
  public uuid: string;

  @IsString()
  @Expose()
  public companyName: string;

  @IsNumber()
  @Expose()
  public transactionsCount: number;
}
