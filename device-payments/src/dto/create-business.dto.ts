import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  public _id: string;
}
