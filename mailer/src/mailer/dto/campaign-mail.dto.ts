import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ServerTypeEnum } from '../enum';

export class CampaignMailDto {
  @ApiProperty()
  @IsNotEmpty()
  public to: string[];

  @ApiProperty()
  @IsString()
  public from: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public subject: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public html: string;

  @ApiProperty()
  @IsOptional()
  public attachments: any[];

  @ApiProperty()
  @IsOptional()
  public serverType?: ServerTypeEnum;
}
