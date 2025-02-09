import { IsNumber } from 'class-validator';

export class AmountDto {
  @IsNumber()
  public min: number;
  @IsNumber()
  public max: number;
}
