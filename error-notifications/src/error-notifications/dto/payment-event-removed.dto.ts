import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentEventRemovedDto {
  @IsNotEmpty()
  @IsString()
  public uuid: string;
}
