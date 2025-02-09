import { FraudListInterface } from '../../interfaces';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, ArrayMinSize, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ListTypeEnum } from '../../enums';

@Exclude()
export class FraudListRequestDto implements FraudListInterface{
  @ApiProperty({ required: true })
  @Expose()
  @IsOptional()
  public businessId?: string;

  @ApiProperty({ required: true })
  @Expose()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiProperty({ required: true, enum: ListTypeEnum })
  @Expose()
  @IsNotEmpty()
  @IsEnum(ListTypeEnum)
  public type: ListTypeEnum;

  @ApiProperty({ required: false, isArray: true, type: String })
  @Expose()
  @IsNotEmpty()
  @ArrayMinSize(1)
  public values: string[];
}
