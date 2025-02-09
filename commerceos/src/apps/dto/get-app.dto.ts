import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { DashboardInfoDto } from './register-app/dashboard-info.dto';
import { Acl } from '../../models/interfaces/dashboard-app/acl.interface';

export class GetAppDto {
  @ApiProperty()
  public microUuid: string;

  @ApiProperty()
  public code: string;

  @ApiProperty()
  public dashboardInfo: DashboardInfoDto;

  @ApiProperty()
  public tag: string;

  @ApiProperty()
  public url: string;

  @ApiProperty()
  public bootstrapScriptUrl: string;

  @ApiProperty()
  public installed: boolean;

  @ApiProperty()
  public default: boolean;

  @ApiProperty()
  public order: number;

  @ApiProperty()
  @IsOptional()
  public started: boolean;

  @ApiProperty()
  @IsOptional()
  public startAt: Date;

  @ApiProperty()
  @IsOptional()
  public allowedAcls: Acl;
}
