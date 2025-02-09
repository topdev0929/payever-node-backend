import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { FlowRequestDto } from '../../../flow';

export class InitRequestDto {
  @ApiProperty({ required: false})
  @IsOptional()
  public initData?: any;

  @ApiProperty({ required: true})
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FlowRequestDto)
  public flow: FlowRequestDto;
}
