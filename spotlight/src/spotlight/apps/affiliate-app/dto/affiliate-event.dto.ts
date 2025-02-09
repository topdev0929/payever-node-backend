import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AffiliateEventDto {

  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public url: string;

  @IsOptional()
  public business: {
    id: string;
  };
}
