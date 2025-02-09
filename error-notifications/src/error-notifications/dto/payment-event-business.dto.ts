import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentEventBusinessDto {
  @IsNotEmpty()
  @IsString()
  public id: string;
}
