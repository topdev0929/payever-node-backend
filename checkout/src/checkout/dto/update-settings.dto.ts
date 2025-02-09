import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { CheckoutSettingsInterface } from '../interfaces';

export class UpdateSettingsDto {
  @ApiProperty({ required: false })
  @IsString()
  public logo: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  public settings: CheckoutSettingsInterface;
}
