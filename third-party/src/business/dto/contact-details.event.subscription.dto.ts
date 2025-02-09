import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class ContactDetailsEventSubscriptionDto {
  @IsString()
  @IsOptional()
  public readonly salutation?: string;

  @IsString()
  @IsOptional()
  public readonly firstName?: string;

  @IsString()
  @IsOptional()
  public readonly lastName?: string;

  @IsString()
  @IsOptional()
  public readonly phone?: string;

  @IsString()
  @IsOptional()
  public readonly fax?: string;

  @IsString()
  @IsOptional()
  public readonly additionalPhone?: string;

  @Exclude()
  private readonly _id: string;

  @Exclude()
  private readonly createdAt: string;

  @Exclude()
  private readonly updatedAt: string;
}
