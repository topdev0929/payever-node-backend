import { IsString, IsOptional } from 'class-validator';

export class ContactDetailsDto {
  @IsString()
  @IsOptional()
  public salutation: string;

  @IsString()
  @IsOptional()
  public firstName: string;

  @IsString()
  @IsOptional()
  public lastName: string;

  @IsString()
  @IsOptional()
  public phone: string;

  @IsString()
  @IsOptional()
  public fax: string;

  @IsString()
  @IsOptional()
  public additionalPhone: string;
}
