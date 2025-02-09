import { IsNumber, IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';


export class AdminChannelDto {
  @IsNumber()
  @IsOptional()
  public legacyId?: number;
  @IsString()
  @IsOptional()
  public type: string;

  @IsBoolean()
  @IsOptional()
  public enabled?: boolean;

  @IsBoolean()
  @IsOptional()
  public enabledByDefault?: boolean;

  @IsBoolean()
  @IsOptional()
  public customPolicy?: boolean;
}
