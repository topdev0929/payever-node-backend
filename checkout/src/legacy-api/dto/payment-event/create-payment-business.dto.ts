import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentBusinessDto {
  @IsNotEmpty()
  @IsString()
  public uuid: string;

  @IsNotEmpty()
  @IsString()
  public company_name: string;

  @IsNotEmpty()
  @IsString()
  public company_email: string;
}
