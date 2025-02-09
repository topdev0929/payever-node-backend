import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class StateReportDto {
  @IsNumber()
  @Expose()
  public transactionsCount: number = 0;

  @IsNumber()
  @Expose()
  public transactionsPercent: number = 0.0;

  @IsNumber()
  @Expose()
  public volumeTotal: number = 0.0;

  @IsNumber()
  @Expose()
  public volumePercent: number = 0.0;

  @IsNumber()
  @Expose()
  public averageTicketTotal: number = 0;

  @IsArray()
  @Expose()
  public activeMerchants: string[] = [];

  @IsNumber()
  @Expose()
  public businessesCount: number = 0;

  @IsNumber()
  @IsOptional()
  @Expose()
  public transactionsCountTrendPercent?: number = 0.0;

  public incrementTransactionsCount(value: number = 1): void {
    this.transactionsCount += value;
  }

  public incrementBusinessesCount(value: number = 1): void {
    this.businessesCount += value;
  }

  public incrementVolumeTotal(value: number): void {
    this.volumeTotal += value;
  }

  public addActiveMerchant(id: string): void {
    if (!this.activeMerchants.includes(id)) {
      this.activeMerchants.push(id);
    }
  }
}
