import { IsNotEmpty, IsString } from 'class-validator';
import { ImageActionDto } from './image-action.dto';

export class ImageCompilerDto extends ImageActionDto {
  @IsString()
  @IsNotEmpty()
  public business: string;
}
