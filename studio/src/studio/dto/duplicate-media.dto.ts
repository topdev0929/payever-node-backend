import { IsNotEmpty, IsOptional } from 'class-validator';

export class DuplicateMediaDto {
  @IsNotEmpty()
  public userMediaIds: string[];

  @IsOptional()
  public album?: string;

  @IsOptional()
  public prefix?: string;
}
