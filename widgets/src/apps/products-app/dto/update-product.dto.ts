import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsString()
  @IsNotEmpty()
  public businessUuid: string;

  @IsOptional()
  public identifier: string;

  @IsNumber()
  @IsNotEmpty()
  public salePrice: number;

  @IsNumber()
  @IsNotEmpty()
  public price: number;

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  public images: string;
}
