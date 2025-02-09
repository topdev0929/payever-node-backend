import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { QRTypeEnum } from '../../../enums';
import { QrPayloadInterface } from '../../../interfaces/incoming';

export class QrSetupMessageDto implements QrPayloadInterface {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public displayAvatar: boolean = true;

  @ApiProperty()
  @IsString()
  public type: QRTypeEnum;
}
