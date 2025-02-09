import { IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsOptional()
  public readonly country?: string;

  @IsString()
  @IsOptional()
  public readonly city?: string;

  @IsString()
  @IsOptional()
  public readonly state?: string;

  @IsString()
  @IsOptional()
  public readonly street?: string;

  @IsString()
  @IsOptional()
  public readonly zipCode?: string;
}
