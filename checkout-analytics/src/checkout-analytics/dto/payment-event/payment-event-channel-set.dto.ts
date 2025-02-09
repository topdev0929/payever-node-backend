import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentEventChannelSetDto {
  @IsNotEmpty()
  @IsString()
  public uuid: string;
}
