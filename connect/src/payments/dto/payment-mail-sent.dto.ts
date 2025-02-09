import { IsOptional, IsString } from 'class-validator';

export class PaymentMailSentDto {
  @IsString()
  public businessId: string;

  @IsString()
  public id: string;

  @IsString()
  @IsOptional()
  public serviceEntityId?: string;

  @IsString()
  public templateName: string;

}
