import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class ChannelDto {
  @ApiProperty()
  @IsInt()
  @IsOptional()
  public legacyId?: number;

  @ApiProperty()
  @IsString()
  public type: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public enabled?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public enabledByDefault?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public customPolicy?: boolean;
}
