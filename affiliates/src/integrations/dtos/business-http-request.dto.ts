import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class BusinessHttpRequestDto {
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public currency: string;
}
