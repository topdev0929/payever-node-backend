import { IsNotEmpty, IsString } from 'class-validator';

export class BusinessMediaReferenceDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}
