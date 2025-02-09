import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

import { PaymentDocumentPayloadInterface } from '../interfaces';

export class UpdatePaymentDocumentsPayloadDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public application_sent?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  public documents?: PaymentDocumentPayloadInterface[];
}
