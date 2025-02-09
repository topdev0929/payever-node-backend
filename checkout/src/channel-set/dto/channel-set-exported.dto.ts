import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChannelSetExportedDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @IsOptional()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public type: string;

  @IsOptional()
  @IsBoolean()
  public customPolicy: boolean;

  @IsOptional()
  @IsBoolean()
  public enabledByDefault: boolean;
}
