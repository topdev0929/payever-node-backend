import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveSiteDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}
