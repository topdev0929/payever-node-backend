import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SetupStatusEnum } from '../enums/setup-status.dto';

export class ToggleSetupStatusDto {
  @ApiProperty()
  @IsEnum(SetupStatusEnum)
  public setupStatus: SetupStatusEnum;
}
