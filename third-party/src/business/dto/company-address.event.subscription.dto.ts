import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CompanyAddressEventSubscriptionDto {
  @IsString()
  @IsOptional()
  public readonly country?: string;

  @IsString()
  @IsOptional()
  public readonly city?: string;

  @IsString()
  @IsOptional()
  public readonly street?: string;

  @IsString()
  @IsOptional()
  public readonly zipCode?: string;

  @Exclude()
  private readonly _id: string;

  @Exclude()
  private readonly createdAt: string;

  @Exclude()
  private readonly updatedAt: string;
}
