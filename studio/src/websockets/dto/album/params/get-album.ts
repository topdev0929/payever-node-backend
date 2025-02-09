import { IsNotEmpty, IsString } from 'class-validator';

export class GetAlbum {
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsString()
  @IsNotEmpty()
  public albumId: string;
}
