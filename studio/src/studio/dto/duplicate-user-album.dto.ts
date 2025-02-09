import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class DuplicateUserAlbumDto {
  @IsNotEmpty()
  public albumIds: string[];

  @IsString()
  @IsOptional()
  public parent: string;

  @IsOptional()
  public prefix?: string;
}
