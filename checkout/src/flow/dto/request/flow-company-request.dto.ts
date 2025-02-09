import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class FlowCompanyRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public externalId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public name?: string;
}
