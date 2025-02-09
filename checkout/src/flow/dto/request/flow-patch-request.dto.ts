import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { FlowRequestDto } from './flow-request.dto';
import { FlowCompanyRequestDto } from './flow-company-request.dto';
import { CustomerTypeEnum } from '../../../common/enum';

export class FlowPatchRequestDto extends FlowRequestDto {
  @ApiProperty({ required: true})
  @IsString()
  @IsOptional()
  @Type(() => String)
  public channelSetId: string;

  @ApiProperty({ required: false})
  @IsOptional()
  @ValidateNested()
  @Type(() => FlowCompanyRequestDto)
  public company?: FlowCompanyRequestDto;

  @ApiProperty({ required: false})
  @IsEnum(CustomerTypeEnum)
  @IsOptional()
  public customerType?: CustomerTypeEnum;
}
