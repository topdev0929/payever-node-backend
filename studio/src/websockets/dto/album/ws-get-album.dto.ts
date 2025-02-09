import { IsNotEmpty } from 'class-validator';
import { GetAlbum } from './params';
import { WsBaseDto } from '../ws-base.dto';

export class WsGetAlbumDto extends WsBaseDto {
  @IsNotEmpty()
  public params: GetAlbum;
}
