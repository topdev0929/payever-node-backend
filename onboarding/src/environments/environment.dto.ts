import { AppConfigDto } from '@pe/nest-kit';
import { IsObject, IsNumber } from 'class-validator';

export class AppConfigDtoLocal extends AppConfigDto {
  @IsObject()
  public webSocket: {
    port: number;
  };

  @IsObject()
  public microservices: {
    authUrl: string;
    checkoutCdnUrl: string;
    checkoutUrl: string;
    commerceosUrl: string;
    commerceosFrontendUrl: string;
    communicationsThirdPartyUrl: string;
    connectUrl: string;
    customStorage: string;
    devicePaymentsUrl: string;
    paymentThirdPartyUrl: string;
    qrUrl: string;
    usersUrl: string;
    posUrl: string;
    posBuilderUrl: string;
    pluginsUrl: string;
    mediaUrl: string;
    wallpapersUrl: string;
    configuratorUrl: string;
  };

  @IsNumber()
  public processorDelayMs: number;

  @IsNumber()
  public organizationTokenExpiresIn: number;

  public organizationTokenExpiresInString: string;
}
