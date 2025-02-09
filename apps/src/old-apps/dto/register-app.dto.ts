import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AccessDto } from './access-dto';
import { DashboardInfoDto } from './dashboard-info.dto';
import { EditDto } from './edit.dto';

export class RegisterAppDto extends EditDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public _id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public code: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public version: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => DashboardInfoDto)
  public dashboardInfo: DashboardInfoDto;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public tag: string;

  // used as business.url for backward compatibility,remove when all frontend micros will use new API
  @ApiProperty()
  @IsString()
  @IsOptional()
  public url: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AccessDto)
  public access: AccessDto;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public bootstrapScriptUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public order: number;
}
