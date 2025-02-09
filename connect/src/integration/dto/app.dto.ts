import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean, ValidateNested } from 'class-validator';
import { TranslationsDto } from './translations.dto';
import { Type } from 'class-transformer';
import { AppConnectDto } from './app-connect.dto';

export class AppDto {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public key: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public category: string;

  @ApiProperty({ deprecated: true})
  @IsNotEmpty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public titleTranslations: TranslationsDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public icon?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public image?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString({ each: true })
  public countryList: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  public price: string;

  @ApiProperty({ deprecated: true})
  @IsOptional()
  @IsString()
  public developer: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public developerTranslations: TranslationsDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString({ each: true })
  public languages: string[];

  @ApiProperty()
  @IsNotEmpty()
  public links: any[];

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  public enabled: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public status: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public rejectionReason: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  public actions: any[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString({ each: true })
  public events: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString({ each: true })
  public scopes: string[];

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AppConnectDto)
  public connect: AppConnectDto;
}
