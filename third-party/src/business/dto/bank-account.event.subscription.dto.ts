import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class BankAccountEventSubscriptionDto {
  @IsString()
  @IsOptional()
  public readonly country?: string;

  @IsString()
  @IsOptional()
  public readonly city?: string;

  @IsString()
  @IsOptional()
  public readonly bankName?: string;

  @IsString()
  @IsOptional()
  public readonly bankCode?: string;

  @IsString()
  @IsOptional()
  public readonly swift?: string;

  @IsString()
  @IsOptional()
  public readonly routingNumber?: string;

  @IsString()
  @IsOptional()
  public readonly accountNumber?: string;

  @IsString()
  @IsOptional()
  public readonly owner?: string;

  @IsString()
  @IsOptional()
  public readonly bic?: string;

  @IsString()
  @IsOptional()
  public readonly iban?: string;

  @Exclude()
  private readonly _id: string;

  @Exclude()
  private readonly createdAt: string;

  @Exclude()
  private readonly updatedAt: string;
}
