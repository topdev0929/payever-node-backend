import { IsNotEmpty } from 'class-validator';
import { ListAlbumsByAttribute } from './params';
import { WsBaseDto } from '../ws-base.dto';

export class WsListAlbumsByAttributeDto extends WsBaseDto {
  @IsNotEmpty()
  public params: ListAlbumsByAttribute;
}
