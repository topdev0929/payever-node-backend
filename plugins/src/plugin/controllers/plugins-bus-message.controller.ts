import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthMessageDto } from '../dto';
import { ShopSystemApiKeyService } from '../services';

@Controller()
export class PluginsBusMessageController {
  constructor(
    private readonly apiKeyService: ShopSystemApiKeyService,
  ) { }

  @MessagePattern({
    name: 'oauth.event.oauthclient.removed',
  })
  public async onOAuthClientRemovedEvent(dto: AuthMessageDto): Promise<void> {
    await this.apiKeyService.deleteOneById(dto.id);
  }
}
