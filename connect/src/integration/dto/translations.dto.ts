import { TranslationsInterface } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class TranslationsDto implements TranslationsInterface{
  @ApiProperty()
  public da: string;

  @ApiProperty()
  public de: string;

  @ApiProperty()
  public en: string;

  @ApiProperty()
  public es: string;

  @ApiProperty()
  public no: string;

  @ApiProperty()
  public sv: string;
}

