import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  BankAccountEventSubscriptionDto,
  CompanyAddressEventSubscriptionDto,
  ContactDetailsEventSubscriptionDto,
} from '../dto';

export class BusinessEventSubscriptionDto {
  @IsString()
  @IsOptional()
  public readonly name?: string;

  @IsString()
  @IsOptional()
  public readonly currency?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyAddressEventSubscriptionDto)
  public readonly companyAddress?: CompanyAddressEventSubscriptionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactDetailsEventSubscriptionDto)
  public readonly contactDetails?: ContactDetailsEventSubscriptionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BankAccountEventSubscriptionDto)
  public readonly bankAccount?: BankAccountEventSubscriptionDto;

  @IsArray()
  @IsOptional()
  public readonly contactEmails?: string[];

  @Exclude()
  public readonly owner: any;

  @Exclude()
  @IsOptional()
  public readonly logo?: string;

  @Exclude()
  @IsOptional()
  public readonly wallpaper?: string;

  @Exclude()
  public readonly active: boolean;

  @Exclude()
  public readonly hidden: boolean;

  @Exclude()
  @IsOptional()
  public readonly companyDetails?: any;

  @Exclude()
  @IsOptional()
  public readonly taxes?: string[];

  @Exclude()
  @IsOptional()
  public readonly cspAllowedHosts?: string[];

  @Exclude()
  public readonly documents: any;

  @IsString()
  private readonly _id: string;

  @IsString()
  @IsOptional()
  private readonly createdAt?: string;

  @IsString()
  @IsOptional()
  private readonly updatedAt?: string;
}
