import { IsNotEmpty } from 'class-validator';
import { WsBaseDto } from '../ws-base.dto';
import { DuplicateAlbums } from './params/duplicate-albums';

export class WsDuplicateAlbumsDto extends WsBaseDto {
  @IsNotEmpty()
  public params: DuplicateAlbums;
}
