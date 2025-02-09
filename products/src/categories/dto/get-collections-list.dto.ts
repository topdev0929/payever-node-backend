import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCollectionsListDto {
  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  public activeSince: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public activeTill?: Date;
}
