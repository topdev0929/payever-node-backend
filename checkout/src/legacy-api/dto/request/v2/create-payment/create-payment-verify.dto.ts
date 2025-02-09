import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TwoFactorTypeEnum, VerifyTypeEnum } from '../../../../enum';

export class CreatePaymentVerifyDto {
  @ApiProperty({ required: false, enum: VerifyTypeEnum})
  @IsEnum(VerifyTypeEnum, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public type?: VerifyTypeEnum;

  @ApiProperty({ required: false, enum: TwoFactorTypeEnum})
  @IsEnum(TwoFactorTypeEnum, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public two_factor?: TwoFactorTypeEnum;
}
