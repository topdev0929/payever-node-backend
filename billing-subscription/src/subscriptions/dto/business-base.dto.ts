import { IsString, IsNotEmpty } from 'class-validator';

export class BusinessBaseDto {
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @IsString()
  @IsNotEmpty()
  public currency: string;
}
