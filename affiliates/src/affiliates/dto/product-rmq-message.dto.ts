import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductRmqMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  public businessUuid: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  public price: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  public title: string;
}
