import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ProductEventDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsNotEmpty()
  @IsString()
  public businessUuid: string;

  @IsString()
  @IsOptional()
  public identifier: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsNumber()
  @IsNotEmpty()
  public salePrice: number;

  @IsNumber()
  @IsNotEmpty()
  public price: number;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  public images: string[];

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  public imagesUrl: string[];

  @IsString()
  public createdAt: string;
}
