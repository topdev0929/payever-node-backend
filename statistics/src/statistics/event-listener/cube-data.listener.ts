import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { EventsGateway } from '../ws';
import { EventMessageNameEnum } from '../enums';

@Injectable()
export class CubeDataListener {

  constructor(
    private readonly event: EventsGateway,
  ) { }

  @EventListener('Cube.data.updated')
  private async handleDataupdated(): Promise<void> {
    this.event.broadcast(EventMessageNameEnum.UPDATE_DATA, { });
  }
}
