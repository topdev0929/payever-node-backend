import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AccessDto } from './register-app/access-dto';
import { DashboardInfoDto } from './register-app/dashboard-info.dto';

export class RegisterAppDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public microUuid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public code: string;

  @ApiProperty({
    type: DashboardInfoDto,
  })
  @ValidateNested()
  @Type((): any => DashboardInfoDto)
  public dashboardInfo: DashboardInfoDto;

  @ApiProperty()
  @IsString()
  public tag: string;

  // used as business.url for backward compatibility,remove when all frontend micros will use new API
  @ApiProperty()
  @IsString()
  @IsOptional()
  public url: string;

  @ApiProperty()
  @ValidateNested()
  @Type((): any => AccessDto)
  public access: AccessDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public bootstrapScriptUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public order: number;
}
