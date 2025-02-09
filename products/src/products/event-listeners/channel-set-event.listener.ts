import { Injectable } from '@nestjs/common';
import { ProductService } from '../services';
import { EventListener } from '@pe/nest-kit';
import { ChannelSetEventEnum } from '../../channel-set/enums';
import { DeletedChannelSetDto, NamedChannelSetDto } from '../../channel-set/dto';
import { ChannelSetService } from '../../channel-set/services';

@Injectable()
export class ChannelSetEventListener {
  constructor(
    private readonly channelSetService: ChannelSetService,
    private readonly productService: ProductService,
  ) { }

  @EventListener(ChannelSetEventEnum.ChannelSetDeleted)
  public async onChannelSetDeleted(channelSetDto: DeletedChannelSetDto): Promise<void> {
    await this.productService.removeAllChannelSet(channelSetDto._id);
  }
}
