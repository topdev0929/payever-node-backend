import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CustomerTypeEnum } from '../../../../../common/enum';

export class CreatePaymentCustomerDto {
  @ApiProperty({ enum: CustomerTypeEnum})
  @IsEnum(CustomerTypeEnum, { groups: ['create', 'submit', 'link']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link']})
  public type: CustomerTypeEnum;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public gender?: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public birthdate?: Date;

  @ApiProperty()
  @IsString({ groups: ['two_factor_sms']})
  @IsOptional({ groups: ['has_order']})
  @IsNotEmpty({ groups: ['two_factor_sms']})
  public phone?: string;

  @ApiProperty()
  @IsOptional({ groups: ['has_order']})
  @IsNotEmpty({ groups: ['two_factor_email', 'submit']})
  @IsEmail({ }, { groups: ['two_factor_email', 'submit']})
  public email?: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public social_security_number?: string;
}
