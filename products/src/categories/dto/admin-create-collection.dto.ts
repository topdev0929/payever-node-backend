import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDefined, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AutomaticFillConditions } from './automatic-fill-conditions.dto';
import { CreateCollectionDto } from '.';

export class AdminCreateCollectionDto extends CreateCollectionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  public businessId: string;
}
