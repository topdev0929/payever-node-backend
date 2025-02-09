import { IsNotEmpty, IsUUID } from 'class-validator';

export class CheckoutBusinessDto {
  @IsUUID('4')
  @IsNotEmpty()
  public uuid: string;
}
