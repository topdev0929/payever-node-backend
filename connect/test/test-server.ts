import { Server } from '@nestjs/microservices';
import { CustomTransportStrategy } from '@nestjs/common/interfaces/microservices/custom-transport-strategy.interface';

export class TestServer extends Server implements CustomTransportStrategy {
  public listen(callback: () => void) {
    throw new Error('Method not implemented.');
  }

  public close() {
    throw new Error('Method not implemented.');
  }
}
