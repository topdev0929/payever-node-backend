import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductRatingDto } from './product-rating.dto';
import { BusinessReferenceDto } from './business-reference.dto';
import { ChannelSetReferenceDto } from './channel-set-reference.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public id: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public country?: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public currency?: string;

  @ApiProperty()
  @IsNumber()
  public price?: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public title?: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public type?: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ProductRatingDto)
  public rating?: ProductRatingDto;

  @ApiProperty()
  @IsNumber()
  public imports: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ChannelSetReferenceDto)
  public channelSet: ChannelSetReferenceDto;
}
