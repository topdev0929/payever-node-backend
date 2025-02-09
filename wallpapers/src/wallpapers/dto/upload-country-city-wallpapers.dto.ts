import { IsNotEmpty, IsString } from 'class-validator';

export class UploadCountryCityWallpapersDto {
  @IsString()
  @IsNotEmpty()
  public city: string;

  @IsString()
  @IsNotEmpty()
  public country: string;

  @IsString()
  @IsNotEmpty()
  public folder: string;

  @IsString()
  @IsNotEmpty()
  public filename: string;

  @IsString()
  @IsNotEmpty()
  public path: string;
}
