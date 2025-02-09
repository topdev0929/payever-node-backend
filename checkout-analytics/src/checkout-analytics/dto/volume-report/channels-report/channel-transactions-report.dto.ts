import { IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { TransactionsReportDto } from '..';
import { SupportedChannelsEnum } from '../../../enums/supported-channels.enum';

@Exclude()
export class ChannelTransactionsReportDto extends TransactionsReportDto {
  @IsString()
  @Expose()
  public channel: SupportedChannelsEnum;

  constructor(channel: SupportedChannelsEnum) {
    super();

    this.channel = channel;
  }
}
