import { IsNotEmpty, IsOptional } from 'class-validator';

export class MoveMediaDto {
  @IsNotEmpty()
  public userMediaIds: string[];

  @IsOptional()
  public album?: string;
}
