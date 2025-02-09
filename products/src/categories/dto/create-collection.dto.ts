import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDefined, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AutomaticFillConditions } from './automatic-fill-conditions.dto';

export class CreateCollectionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  public slug: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public image?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsDefined()
  public channelSets: string[];

  @ApiProperty({ required: true })
  @IsDate()
  @Type(() => Date)
  public activeSince: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  public activeTill?: Date;

  @ValidateNested()
  @Type(() => AutomaticFillConditions)
  @IsOptional()
  public automaticFillConditions?: AutomaticFillConditions;

  @IsOptional()
  public parent?: string;
}
