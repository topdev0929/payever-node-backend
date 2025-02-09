import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsValidNameDto } from './is-valid-name.dto';

export class AdminIsValidNameDto extends IsValidNameDto {
  @ApiProperty({ required: true})
  @IsString()
  public businessId: string;
}
