import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AdminCreateScheduleDto } from './admin-create-schedule.dto';

export class AdminCreateCampaignDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public status: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public themeId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public preview?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public categories?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  public contacts?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  public date: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  public from?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => AdminCreateScheduleDto)
  @ValidateNested({ each: true })
  public schedules?: AdminCreateScheduleDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  public template?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public productIds?: string[];
}

