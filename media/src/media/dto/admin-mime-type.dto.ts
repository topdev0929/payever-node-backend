import { IsNotEmpty, IsString, IsOptional } from 'class-validator';


export class AdminMimeTypeDto {
  @IsString()
  @IsNotEmpty()
  public key: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  public description: string;

  @IsString({ each: true })
  @IsOptional()
  public groups: string[];
}
