import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChannelMessageDto {
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
