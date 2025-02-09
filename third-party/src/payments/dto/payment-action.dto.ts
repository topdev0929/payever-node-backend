import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class PaymentActionDto {
  @ApiProperty()
  @IsDefined()
  public fields: { };

  @ApiProperty()
  @IsString()
  public reference: string;
}
