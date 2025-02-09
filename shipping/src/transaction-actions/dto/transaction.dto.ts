import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TransactionDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  public created_at: Date;
}
