import { Injectable } from '@nestjs/common';
import { MediaRabbitEvents, MediaEventsListener, mediaChangedDtoFake } from '@pe/media-sdk';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';

@Injectable()
export class MediaEventsMessagesMock extends AbstractMessageMock {
  @PactRabbitMqMessageProvider(MediaRabbitEvents.MediaAssigned)
  public async mockMediaAssignedEventProduced(): Promise<void> {
    const producer: MediaEventsListener = await this.getProvider<MediaEventsListener>(MediaEventsListener);
    await producer.handleMediaChanged(mediaChangedDtoFake);
  }

  @PactRabbitMqMessageProvider(MediaRabbitEvents.MediaRemoved)
  public async mockMediaRemovedEventProduced(): Promise<void> {
    const producer: MediaEventsListener = await this.getProvider<MediaEventsListener>(MediaEventsListener);
    await producer.handleMediaChanged(mediaChangedDtoFake);
  }
}
