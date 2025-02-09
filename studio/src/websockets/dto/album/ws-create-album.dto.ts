import { IsNotEmpty } from 'class-validator';
import { WsBaseDto } from '../ws-base.dto';
import { UserAlbumDto } from '../../../studio/dto';

export class WsCreateAlbumDto extends WsBaseDto {
  @IsNotEmpty()
  public params: UserAlbumDto;
}
