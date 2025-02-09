import { IsNotEmpty, IsString } from 'class-validator';

export class TransactionDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;
}
