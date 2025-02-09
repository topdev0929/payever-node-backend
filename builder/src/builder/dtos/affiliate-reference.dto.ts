import { IsNotEmpty, IsString } from 'class-validator';

export class AffiliateReferenceDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public email: string;
}
