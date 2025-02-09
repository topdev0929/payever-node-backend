import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ChangedBpoDto } from './changed-bpo.dto';

export class ChangedBpoMessageDto {
  @ApiProperty()
  @Type(() => ChangedBpoDto)
  @ValidateNested()
  public business_payment_option: ChangedBpoDto;
}
