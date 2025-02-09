import { ApiProperty } from '@nestjs/swagger';

export class GetBusinessDto {

  @ApiProperty()
  public active: boolean;

  @ApiProperty()
  public category: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public logo: string;

  @ApiProperty()
  public wallpaper: string;

  @ApiProperty()
  public legalForm: string;

  @ApiProperty()
  public country: string;

  @ApiProperty()
  public city: string;

  @ApiProperty()
  public street: string;

  @ApiProperty()
  public zipCode: string;

  @ApiProperty()
  public phone: string;

}
