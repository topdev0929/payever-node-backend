import { AppConfigDto } from '@pe/nest-kit';
import { IsNumber, IsObject, IsString, IsOptional, IsBoolean } from 'class-validator';

export class AppConfigDtoLocal extends AppConfigDto {
  @IsNumber()
  @IsOptional()
  public statusPort: number;

  @IsObject()
  public debounceEvents: {
    wait: number;
    maxWait: number;
  };

  public rabbitmq: AppConfigDto['rabbitmq'] & {
    stompBrokerUrl: string;
  };
  @IsNumber()
  public wsPort: number;

  @IsString()
  public wsMicro: string;


  @IsObject()
  public encryption: {
    masterKey: string;
  };

  @IsString()
  public authMicroBaseUrl: string;

  @IsString()
  public whatsappMicroUrl: string;

  @IsString()
  public facebookMessengerMicroUrl: string;

  @IsString()
  public instagramMessengerMicroUrl: string;

  @IsString()
  public thirdPartyMessengerMicroUrl: string;

  @IsObject()
  public other: {
    shopUrl: string;
  };

  @IsObject()
  public elastic: {
    cloudId: string;
    host: string;
    password: string;
    username: string;
  };

  @IsNumber()
  public dbConsumerPrefetchCount: number;

  @IsNumber()
  public stompDefaultPrefetchCount: number;

  @IsBoolean()
  public pact: boolean;
}
