import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ShippingOrderProcessedMessageDto {
  @IsString()
  @IsNotEmpty()
  public transactionId: string;

  @IsString()
  public trackingNumber: string;

  @IsString()
  public trackingUrl: string;

  @IsString()
  @IsOptional()
  public shippedAt?: string;

  @IsOptional()
  public business: {
    id: string;
  };

  @IsOptional()
  public id: string;
}
