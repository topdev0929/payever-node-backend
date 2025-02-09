import { ApiProperty } from '@nestjs/swagger';

export class GetBusinessWallpapersDto {

  @ApiProperty()
  public myWallpapers: boolean;

}
