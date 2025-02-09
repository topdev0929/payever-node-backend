import { IsNotEmpty } from 'class-validator';
import { WsBaseDto } from '../ws-base.dto';
import { UpdateUserAlbumDto } from '../../../studio/dto';

export class WsUpdateAlbumDto extends WsBaseDto {
  @IsNotEmpty()
  public params: UpdateUserAlbumDto;
}
