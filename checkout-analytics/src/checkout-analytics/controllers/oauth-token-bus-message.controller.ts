import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OAuthTokenService } from '../services';
import { MessageBusChannelsEnum, MessageBusEventsEnum } from '../enums';
import { OAuthTokenEventDto } from '../dto';

@Controller()
export class OAuthTokenBusMessageController {
  constructor(
    private readonly oauthTokenService: OAuthTokenService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.OAuthAccessTokenIssued,
  })
  public async onOAuthTokenIssued(data: OAuthTokenEventDto): Promise<void> {
    await this.oauthTokenService.createOAuthTokenFromEvent(data);
  }
}
