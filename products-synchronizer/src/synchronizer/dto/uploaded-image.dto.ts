import { IsNotEmpty, IsString } from 'class-validator';

export class UploadedImageDto {
  @IsString()
  @IsNotEmpty()
  public originalName: string;
  @IsString()
  @IsNotEmpty()
  public url: string;
}
