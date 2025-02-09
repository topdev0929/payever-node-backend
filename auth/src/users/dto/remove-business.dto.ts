import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveBusinessDto {
  @IsNotEmpty()
  @IsString()
  public _id: string;
}
