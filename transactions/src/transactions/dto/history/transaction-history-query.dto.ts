import { IsNumber, IsOptional, IsString, Max } from 'class-validator';
import { Transform } from 'class-transformer';
export class TransactionHistoryQueryDto {
  @IsOptional()
  @IsString()
  public action?: string;

  @IsOptional()
  @IsNumber()
  @Transform(parseInt)
  @Max(20)
  public limit?: number = 20;

  @IsOptional()
  @IsString()
  public status?: string;
}
