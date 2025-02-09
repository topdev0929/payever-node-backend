import { ApiProperty } from '@nestjs/swagger';
import { LinkModelDto } from './link-model.dto';
import { TranslationsDto } from './translations.dto';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';


export class InstallationOptionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  public optionIcon?: string;

  @ApiProperty()
  @IsOptional()
  public price: string;

  @ApiProperty()
  @IsOptional()
  public links: LinkModelDto[];

  @ApiProperty()
  @IsOptional()
  public countryList: string[];

  @ApiProperty()
  @IsOptional()
  public category: string; // TODO Remove?

  @ApiProperty({ deprecated: true})
  @IsOptional()
  public developer: string;

  @ApiProperty()
  @IsOptional()
  public developerTranslations: TranslationsDto;

  @ApiProperty()
  @IsOptional()
  public languages: string;

  @ApiProperty()
  @IsOptional()
  public description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public appSupport?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public website?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public pricingLink?: string;
}
