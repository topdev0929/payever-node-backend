import { IsNotEmpty, IsString } from 'class-validator';
import { VideoActionDto } from './video-action.dto';

export class VideoCompilerDto extends VideoActionDto {
  @IsString()
  @IsNotEmpty()
  public business: string;
}
