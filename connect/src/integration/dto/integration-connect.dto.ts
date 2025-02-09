import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import { IntegrationConnectFormActionDto } from './integration-connect-form-action.dto';

export class IntegrationConnectDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => IntegrationConnectFormActionDto)
  public formAction: IntegrationConnectFormActionDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public url: string;
}
