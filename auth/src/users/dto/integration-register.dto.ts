import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DataRegisterIntegrationDto } from './data-register-integration.dto';

export class IntegrationRegisterDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'forms.error.validator.required',
  })
  @ValidateNested({ each: true })
  @Type(() => DataRegisterIntegrationDto)
  public data: DataRegisterIntegrationDto;
}
