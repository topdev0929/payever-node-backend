import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

import { VerificationType } from '../enum';

export class SettingsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  public secondFactor: boolean = false;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(VerificationType)
  public verificationType: VerificationType = VerificationType.verifyByPayment;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  public autoresponderEnabled: boolean = true;
}
