import { AppConfigDto } from '@pe/nest-kit';
import { IsBoolean, IsObject } from 'class-validator';

export class AppConfigDtoLocal extends AppConfigDto {
  @IsObject()
  public elastic: {
    cloudId: string;
    host: string;
    password: string;
    username: string;
  };

  public rsa: {
    private: string;
  };

  @IsBoolean()
  public pact: boolean;
}
