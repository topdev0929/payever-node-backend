import { IsNotEmpty } from 'class-validator';
import { ListAlbums } from './params';
import { WsBaseDto } from '../ws-base.dto';

export class WsListAlbumsDto extends WsBaseDto {
  @IsNotEmpty()
  public params: ListAlbums;
}
