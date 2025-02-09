import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentEventBusinessDto {
  @IsNotEmpty()
  @IsString()
  public uuid: string;

  @IsNotEmpty()
  @IsString()
  public company_name: string;
}
