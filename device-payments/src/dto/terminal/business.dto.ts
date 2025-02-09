import { IsString, IsNotEmpty } from 'class-validator';

export class BusinessDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}
