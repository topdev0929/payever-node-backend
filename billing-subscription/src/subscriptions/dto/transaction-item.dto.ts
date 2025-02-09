import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemExtraDataDto } from './item-extra-data.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionItemRmqMessageDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public identifier: string;

  @ApiProperty({ required: false })
  @ValidateNested()
  @IsOptional()
  @Type(() => ItemExtraDataDto)
  public extra_data?: ItemExtraDataDto;
}
