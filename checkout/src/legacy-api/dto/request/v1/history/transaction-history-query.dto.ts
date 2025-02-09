import { IsNumber, IsOptional, IsString, Max } from 'class-validator';
import { Expose, Exclude } from 'class-transformer';
@Exclude()
export class TransactionHistoryQueryDto {

  @IsOptional()
  @IsNumber()
  @Max(20)
  @Expose()
  public limit?: number;

  @IsOptional()
  @IsString()
  @Expose()
  public status?: string;
}
