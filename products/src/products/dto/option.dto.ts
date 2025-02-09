import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class OptionDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  public type: string;

  @IsString()
  @IsNotEmpty()
  public value: string;

  @IsOptional()
  public extra: any;
}
