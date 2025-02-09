import { IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { CheckoutSection } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class SectionDto {

  @ApiProperty({ required: true })
  @Expose()
  @IsNotEmpty()
  @IsEnum(CheckoutSection)
  public code: CheckoutSection;

  @ApiProperty({ required: true })
  @Expose()
  @IsNotEmpty()
  public order: number;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  public enabled?: boolean;
}
