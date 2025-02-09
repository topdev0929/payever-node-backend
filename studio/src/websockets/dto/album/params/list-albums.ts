import { IsNotEmpty, IsString } from 'class-validator';
import { BuilderPaginationDto } from '../../../../studio/dto';

export class ListAlbums {
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  public pagination: BuilderPaginationDto;
}
