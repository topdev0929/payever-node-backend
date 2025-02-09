import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreatePaymentSellerDto {
  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  @IsString({ groups: ['create', 'submit']})
  public id?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  @IsString({ groups: ['create', 'submit']})
  public first_name?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  @IsString({ groups: ['create', 'submit']})
  public last_name?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  @IsString({ groups: ['create', 'submit']})
  public email?: string;

}
