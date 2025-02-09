import { Injectable, Logger } from '@nestjs/common';
import { ApiCallModel, NotificationModel } from '../models';
import { ClientSecretResponseDto } from '../dto';
import { ApiCallService } from './api-call.service';
import { OAuthService } from './oauth.service';
import { createHmac } from 'crypto';

@Injectable()
export class NotificationSignatureGenerator {
  constructor(
    private readonly apiCallService: ApiCallService,
    private readonly oAuthService: OAuthService,
    private readonly logger: Logger,
  ) { }

  public async generateNotificationSignature(notificationModel: NotificationModel): Promise<string> {
    const apiCallModel: ApiCallModel = await this.apiCallService.findByApiCallId(notificationModel.apiCallId);

    if (!apiCallModel || !apiCallModel.clientId || !apiCallModel.businessId) {
      return null;
    }

    let clientSecret: string;

    try {
      const clientSecretDto: ClientSecretResponseDto =
        await this.oAuthService.getOAuthClientSecret(apiCallModel.clientId, apiCallModel.businessId);

      clientSecret = clientSecretDto.secret;

      if (!clientSecret) {
        return null;
      }
    } catch (error) {
      this.logger.warn({
        businessId: apiCallModel.businessId,
        clientId: apiCallModel.clientId,
        error: error.response?.data ? error.response.data : error.message,
        message: 'Failed to get client secret from auth micro',
      });

      return null;
    }

    return createHmac('sha256', clientSecret)
      .update(apiCallModel.clientId + notificationModel.paymentId)
      .digest('hex');
  }
}
