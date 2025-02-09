import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateChannelSetDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public active: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public customPolicy: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public enabledByDefault: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public originalId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public policyEnabled: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public type: string;
}
