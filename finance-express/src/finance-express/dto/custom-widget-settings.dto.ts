import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class CustomWidgetSettingDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public isVisible?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public isDefault?: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public height?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public maxWidth?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public maxHeight?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public minWidth?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public minHeight?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public theme?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public alignment?: number;

  @ApiProperty()
  @IsDefined()
  @IsOptional()
  public styles?: any;
}
