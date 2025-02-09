import { IsNotEmpty, IsString } from 'class-validator';
import { DuplicateUserAlbumDto } from '../../../../studio/dto';

export class DuplicateAlbums extends DuplicateUserAlbumDto {
  @IsString()
  @IsNotEmpty()
  public businessId: string;
}
