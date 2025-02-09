import { IsNotEmpty, IsString } from 'class-validator';

export class CheckoutLinkedDto {
  @IsNotEmpty()
  @IsString()
  public channelSetId: string;

  @IsNotEmpty()
  @IsString()
  public checkoutId: string;
}
