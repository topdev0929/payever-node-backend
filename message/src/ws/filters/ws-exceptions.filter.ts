import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class WsExceptionsFilter extends BaseWsExceptionFilter {
  public catch(exception: any, host: ArgumentsHost): void {
    if (exception.message) {
      const client: any = host.switchToWs().getClient();
      client.emit('exception', {
        message: exception.message,
        name: exception.name,
        status: exception.status,
      });

      return;
    }

    super.catch(exception, host);
  }
}
