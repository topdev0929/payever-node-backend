import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentChannelDto {
  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public name?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public type?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public source?: string;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Transform((value: any) => (value ? Number(value) : null))
  public channel_set_id?: number;
}
