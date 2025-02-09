import { RuleConditionInterface } from '../../interfaces';
import { RuleOperatorEnum, RuleTypeEnum } from '../../enums';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { RuleTimeUnitEnum } from '../../enums/rule-time-unit.enum';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class RuleConditionRequestDto implements RuleConditionInterface {
  @ApiProperty({ required: true, enum: RuleTypeEnum})
  @Expose()
  @IsEnum(RuleTypeEnum)
  @IsNotEmpty()
  public type: RuleTypeEnum;

  @ApiProperty({ required: false })
  @Expose()
  @IsEnum(RuleOperatorEnum)
  @IsOptional()
  public operator?: RuleOperatorEnum;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  public value?: any;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  public field?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  public compareTo?: string;

  @ApiProperty({ required: false, enum: RuleTimeUnitEnum })
  @Expose()
  @IsOptional()
  @IsEnum(RuleTimeUnitEnum)
  public timeUnit?: RuleTimeUnitEnum;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  public customField?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  public listId?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @Transform((value: string) => {
    if (value) {
      return new Date(value);
    } else {
      return undefined;
    }
  }, { toClassOnly: true })
  public expiryDate?: Date;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  public threshold?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  public geoLocation?: string;

}
