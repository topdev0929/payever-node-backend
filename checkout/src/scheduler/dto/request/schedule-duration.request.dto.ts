import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsEnum } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { DurationTypeEnum, DurationUnitEnum } from '../../enum';

@Exclude()
export class ScheduleDurationRequestDto {
  @ApiProperty()
  @IsEnum(DurationTypeEnum, { groups: ['create']})
  @IsNotEmpty({ groups: ['create']})
  @Expose()
  public type: DurationTypeEnum;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create']})
  @IsNotEmpty({ groups: ['create']})
  @Expose()
  public period: number;

  @ApiProperty()
  @IsEnum(DurationUnitEnum, { groups: ['create']})
  @IsNotEmpty({ groups: ['create']})
  @Expose()
  public unit: DurationUnitEnum;
}
