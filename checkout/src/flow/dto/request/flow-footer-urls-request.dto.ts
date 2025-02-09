import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FlowAddressInterface } from '../../interfaces';

export class FlowFooterUrlsRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public disclaimer?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public logo?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public privacy?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public support?: string;
}
