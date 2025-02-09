import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class ProductChannelSetDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsString()
  public type: string;

  @IsOptional()
  @IsString()
  public name?: string;
}
