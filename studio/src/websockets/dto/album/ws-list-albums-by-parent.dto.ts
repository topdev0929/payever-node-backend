import { IsNotEmpty } from 'class-validator';
import { ListAlbumsByParent } from './params';
import { WsBaseDto } from '../ws-base.dto';

export class WsListAlbumsByParentDto extends WsBaseDto {
  @IsNotEmpty()
  public params: ListAlbumsByParent;
}
