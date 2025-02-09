import { ApiProperty } from '@nestjs/swagger';
import { LinkModelDto } from './link-model.dto';

export class InstallationOptionsDto {

  @ApiProperty()
  public optionIcon: string;

  @ApiProperty()
  public price: string;

  @ApiProperty()
  public links: LinkModelDto[];

  @ApiProperty()
  public countryList: string[];

  @ApiProperty()
  public category: string; // TODO Remove?

  @ApiProperty()
  public developer: string;

  @ApiProperty()
  public languages: string;

  @ApiProperty()
  public description: string;

  @ApiProperty()
  public appSupport: string;

  @ApiProperty()
  public website: string;

  @ApiProperty()
  public pricingLink: string;
}
