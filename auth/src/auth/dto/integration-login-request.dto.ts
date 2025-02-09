import { LoginRequestDto } from './login-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class IntegrationLoginRequestDto {

  @ApiProperty()
  @IsNotEmpty({
    message: 'forms.error.validator.required',
  })
  public data: LoginRequestDto;
}
