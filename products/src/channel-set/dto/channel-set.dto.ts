import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChannelSetDto {
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
