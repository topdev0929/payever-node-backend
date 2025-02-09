import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ContactCommunicationDto } from '../../message/dto';

export class ContactUpdateHttpRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public avatar?: string;

  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty({
    isArray: true,
    type: ContactCommunicationDto,
  })
  @Type(() => ContactCommunicationDto)
  @ValidateNested({
    each: true,
  })
  public communications: ContactCommunicationDto[];
}
