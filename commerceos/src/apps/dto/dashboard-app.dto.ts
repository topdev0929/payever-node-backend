import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DashboardApp } from '../../models/interfaces/dashboard-app';
import { Document } from 'mongoose';
import { Access } from '../../models/interfaces/dashboard-app/access';
import { DashboardInfo } from '../../models/interfaces/dashboard-app/dashboard-info';
import { PlatformHeader } from '../../models/interfaces/dashboard-app/platform-header';

export class DashboardAppDto implements DashboardApp {
  @ApiProperty()
  @IsString()
  public _id: string;

  @ApiProperty()
  @IsString()
  public code: string;

  @ApiProperty()
  @IsOptional()
  public dashboardInfo?: DashboardInfo & Document<any>;

  @ApiProperty()
  @IsString()
  public tag: string;

  @ApiProperty()
  @IsOptional()
  public access: Access & Document<any>;

  @ApiProperty()
  @IsString()
  public bootstrapScriptUrl: string;

  @ApiProperty()
  @IsOptional()
  public businessTypes: string[];

  @ApiProperty()
  @IsNumber()
  public order: number;

  @ApiProperty()
  @IsOptional()
  public allowedAcls?: { create: boolean; read: boolean; update: boolean; delete: boolean };

  @ApiProperty()
  @IsOptional()
  public platformHeader?: PlatformHeader & Document<any>;
}
