import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsDateString } from 'class-validator';

export class TransactionPaymentRemoveDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @ValidateNested()
  public business: BusinessInerface;

  @IsNotEmpty()
  @ValidateNested()
  public channel_set: ChannelSetInterface;

  @IsNumber()
  @IsNotEmpty()
  public amount: number;

  @IsDateString()
  public date: string;
}

interface ChannelSetInterface {
  id: string;
}

interface BusinessInerface {
  id: string;
}
