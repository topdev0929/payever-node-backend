import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DefaultApps } from '../../models/interfaces/default-apps';
import { Types, Document } from 'mongoose';
import { InstalledApp } from '../../models/interfaces/installed-app';

export class DefaultAppDto implements DefaultApps{
  @ApiProperty()
  @IsString()
  public _id: string;

  @ApiProperty()
  @IsNotEmpty()
  public installedApps: Types.DocumentArray<InstalledApp & Document<any>>;
}
