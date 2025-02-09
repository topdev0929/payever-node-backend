import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeSetupStepDto {
  @ApiProperty()
  @IsString()
  public setupStep: string;
}
