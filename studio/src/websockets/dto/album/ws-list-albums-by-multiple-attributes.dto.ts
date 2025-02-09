import { IsNotEmpty } from 'class-validator';
import { ListAlbumsByMultipleAttributes } from './params';
import { WsBaseDto } from '../ws-base.dto';

export class WsListAlbumsByMultipleAttributesDto extends WsBaseDto {
  @IsNotEmpty()
  public params: ListAlbumsByMultipleAttributes;
}
