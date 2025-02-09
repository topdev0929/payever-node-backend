import { IsString, IsBoolean, IsDate, IsOptional } from 'class-validator';

export class UserAccountDto {
  @IsString()
  public _id: string;

  @IsString()
  public language?: string;

  @IsString()
  public salutation?: string;

  @IsString()
  public firstName?: string;

  @IsString()
  public lastName?: string;

  @IsString()
  public phone?: string;

  @IsString()
  public email?: string;

  @IsDate()
  @IsOptional()
  public birthday?: Date;

  @IsString()
  public createdAt?: string;

  @IsString()
  public logo?: string;

  @IsBoolean()
  public hasUnfinishedBusinessRegistration?: boolean;
}
