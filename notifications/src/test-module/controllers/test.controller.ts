import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectNotificationsEmitter, NotificationsEmitter } from '@pe/notifications-sdk';

@Controller('bus-test')
@ApiTags('bus-test')
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class TestController {
  constructor(
    @InjectNotificationsEmitter() private notificationsEmitter: NotificationsEmitter,
  ) { }

  @Post('/notification/:kind/:entity/:app')
  @HttpCode(HttpStatus.OK)
  public async createBusiness(
    @Param('kind') kind: string,
    @Param('entity') entity: string,
    @Param('app') app: string,
    @Body() body: { message: string; data: { } },
  ): Promise<{ }> {
    await this.notificationsEmitter.sendNotification(
      {
        app: app,
        entity: entity,
        kind: kind,
      },
      body.message,
      body.data,
    );

    return {
      payload: {
        app: app,
        data: body.data,
        entity: entity,
        kind: kind,
        message: body.message,
      },
      result: 'sent',
    };
  }
}
