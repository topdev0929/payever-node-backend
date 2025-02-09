import { FraudRuleInterface } from '../../interfaces';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested, IsNotEmpty } from 'class-validator';
import { RuleActionRequestDto } from './rule-action-request.dto';
import { RuleConditionRequestDto } from './rule-condition-request.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class FraudRuleRequestDto implements FraudRuleInterface{
  @ApiProperty({ required: false })
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

  @ApiProperty({ required: false, type: RuleActionRequestDto, isArray: true })
  @Expose()
  @IsOptional()
  @Type( () => RuleActionRequestDto)
  @ValidateNested({ each: true})
  public actions: RuleActionRequestDto[];

  @ApiProperty({ required: false, type: RuleConditionRequestDto, isArray: true })
  @Expose()
  @IsOptional()
  @Type( () => RuleConditionRequestDto)
  @ValidateNested({ each: true})
  public conditions: RuleConditionRequestDto[];
}
