import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {  
  @ApiProperty()
  @IsString()
  public _id?: string;

  @ApiProperty()
  @IsNumber()
  public price: number;
  
  @ApiProperty()
  @IsString()
  public title: string;
  
  @ApiProperty()
  @IsString()
  public image?: string;
}
