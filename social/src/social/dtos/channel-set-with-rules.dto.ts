import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChannelSetInterface } from '../../channel-set';
import { RuleInterface } from '@pe/third-party-rules-sdk';

export class ChannelSetWithRulesDto {
  @IsOptional()
  @ApiProperty()
  public channelSet: ChannelSetInterface;
  
  @IsOptional()
  @ApiProperty()
  public rules: RuleInterface[];
}
