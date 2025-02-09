import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PaymentFlowEventDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsOptional()
  @IsString()
  public payment_method: string;

  @IsOptional()
  @IsString()
  public api_call_create_id: string;

  @IsOptional()
  @IsString()
  public business_id: string;
}
