import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentListFilterDto {
  @ApiPropertyOptional()
  public paymentMethod?: string;

  @ApiPropertyOptional()
  public date?: string;

  @ApiPropertyOptional()
  public dateLt?: Date;

  @ApiPropertyOptional()
  public dateGt?: Date;

  @ApiPropertyOptional()
  public totalLt?: number;

  @ApiPropertyOptional()
  public totalGt?: number;

  @ApiPropertyOptional()
  public currency?: string;

  @ApiPropertyOptional()
  public status?: string;

  @ApiPropertyOptional()
  public specificStatus?: string;

  @ApiPropertyOptional()
  public paymentId?: string;

  @ApiPropertyOptional()
  public limit?: number;

  constructor(
    paymentMethod: string,
    date: string,
    currency: string,
    status: string,
    limit: string,
  ) {
    this.paymentMethod = paymentMethod;
    this.date = date;
    this.currency = currency;
    this.status = status;
    this.limit = this.prepareLimit(limit);
  }

  private prepareLimit(limit: string): number {
    const DEFAULT_LIMIT: number = 10;
    const MAX_LIMIT: number = 20;
    if (!limit) {
      return DEFAULT_LIMIT;
    }
    const numeralLimit: number = parseInt(limit, 10);
    if (numeralLimit >= MAX_LIMIT) {
      return MAX_LIMIT;
    }

    return MAX_LIMIT;
  }
}
