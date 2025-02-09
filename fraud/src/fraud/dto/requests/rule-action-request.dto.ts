import { RuleActionInterface } from '../../interfaces';
import { RuleActionEnum } from '../../enums';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class RuleActionRequestDto implements RuleActionInterface {
  @ApiProperty({ required: true, enum: RuleActionEnum })
  @Expose()
  @IsEnum(RuleActionEnum)
  @IsNotEmpty()
  public type: RuleActionEnum;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  public value?: any;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  public webhookUrl?: string;
}
