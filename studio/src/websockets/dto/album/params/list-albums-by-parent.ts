import { IsNotEmpty, IsString } from 'class-validator';
import { BuilderPaginationDto } from '../../../../studio/dto';

export class ListAlbumsByParent {
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsString()
  @IsNotEmpty()
  public albumId: string;

  public pagination: BuilderPaginationDto;
}
