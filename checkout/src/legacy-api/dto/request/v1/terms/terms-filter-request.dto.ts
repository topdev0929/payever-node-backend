import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { TermsFilterChannelRequestDto } from './terms-filter-channel-request.dto';

export class TermsFilterRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => TermsFilterChannelRequestDto)
  public channel?: TermsFilterChannelRequestDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public locale?: string;
}

