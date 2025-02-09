import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreatePaymentLinkMessageDto {
  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'link', 'submit']})
  public content?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'link', 'submit']})
  public subject?: string;
}
