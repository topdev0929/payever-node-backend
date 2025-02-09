import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentChannelSetDto {
  @IsNotEmpty()
  @IsString()
  public uuid: string;
}
