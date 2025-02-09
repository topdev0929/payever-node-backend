import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePaymentDeviceBrowserDto {
  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public user_agent?: string;
}
