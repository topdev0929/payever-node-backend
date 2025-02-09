import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class IntegrationDto {

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsOptional()
  @IsBoolean()
  public isEnabled: boolean;
  
  @IsString()
  @IsNotEmpty()
  public category: string;

  @IsString()
  @IsNotEmpty()
  public categoryIcon: string;

}
