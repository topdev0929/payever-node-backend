import { IsString } from 'class-validator';

export class BusinessDto {
  @IsString()
  public id: string;
}
