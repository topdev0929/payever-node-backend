import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CommonActionDto } from './common-action.dto';

export class AuthorizeActionDto extends CommonActionDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public amount?: number;
}
