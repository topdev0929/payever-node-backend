import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class SocialEventDto {

  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsOptional()
  public content: string;
}
