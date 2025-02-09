import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsHexColor,
  IsNotEmpty,
} from 'class-validator';
import {
  Transform,
} from 'class-transformer';
import { trulyStringToBoolean } from '../../../transformers';

export class CheckoutStylesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  public active: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public businessHeaderBorderColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public businessHeaderBackgroundColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Transform(Number)
  public businessHeaderDesktopHeight?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Transform(Number)
  public businessHeaderMobileHeight?: number;

  @ApiProperty()
  @IsOptional()
  @IsHexColor()
  public buttonBackgroundColor?: string;

  @ApiProperty()
  @IsOptional()
  @Transform((value: string) => trulyStringToBoolean(value))
  @IsBoolean()
  public buttonFill?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsHexColor()
  public buttonBackgroundDisabledColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsHexColor()
  public buttonTextColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public buttonBorderRadius?: string;

  @ApiProperty()
  @IsOptional()
  @IsHexColor()
  public pageBackgroundColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsHexColor()
  public pageLineColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsHexColor()
  public pageTextPrimaryColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsHexColor()
  public pageTextSecondaryColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsHexColor()
  public pageTextLinkColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsHexColor()
  public inputBackgroundColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsHexColor()
  public inputBorderColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsHexColor()
  public inputTextPrimaryColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsHexColor()
  public inputTextSecondaryColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public inputBorderRadius?: string;
}
