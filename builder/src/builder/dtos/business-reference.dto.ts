import { IsNotEmpty, IsString } from 'class-validator';

export class BusinessReferenceDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}
