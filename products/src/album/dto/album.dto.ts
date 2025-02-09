import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class AlbumDto {
  @IsString()
  @IsOptional()
  public description: string;

  @IsOptional()
  @IsUrl()
  public icon: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsOptional()
  public parent: string;
}
