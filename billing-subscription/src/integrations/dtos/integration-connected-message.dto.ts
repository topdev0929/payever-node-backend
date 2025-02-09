import { ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessReferenceDto } from '../../subscriptions/dto/business-reference.dto';
import { IntegrationDto } from './integration.dto';
import { ConnectionRmqMessageDto } from './connection-rmq-message.dto';
import { ApiProperty } from '@nestjs/swagger';

export class IntegrationConnectedRmqMessageDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;

  @ApiProperty({ required: true })
  @IsDefined()
  @ValidateNested()
  @Type(() => ConnectionRmqMessageDto)
  public connection: ConnectionRmqMessageDto;

  @ApiProperty({ required: true })
  @IsDefined()
  @ValidateNested()
  @Type(() => IntegrationDto)
  public integration: IntegrationDto;
}
