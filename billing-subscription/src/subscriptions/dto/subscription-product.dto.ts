import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionProductDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public _id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  public price: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  public title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  public image: string;
}
