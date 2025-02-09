import { ApiProperty } from '@nestjs/swagger';
import { TranslationsDto } from './translations.dto';
import { IsOptional } from 'class-validator';


export class DisplayOptionsDto {
  @ApiProperty({ deprecated: true})
  @IsOptional()
  public title: string;

  @ApiProperty()
  @IsOptional()
  public titleTranslations: TranslationsDto;

  @ApiProperty()
  @IsOptional()
  public icon: string;
}
