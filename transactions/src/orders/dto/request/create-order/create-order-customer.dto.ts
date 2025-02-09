import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateOrderCustomerDto {
  @ApiProperty()
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public birthdate?: Date;

  @ApiProperty()
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public phone?: string;

  @ApiProperty()
  @IsEmail({ }, { groups: ['create']})
  @IsOptional({ groups: ['create']})
  public email?: string;
}
