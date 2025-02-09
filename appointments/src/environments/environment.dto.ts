import { AppConfigDto } from '@pe/nest-kit';
import { IsNumber, IsOptional } from 'class-validator';

export class AppConfigDtoLocal extends AppConfigDto {
  @IsOptional()
  @IsNumber()
  public statusPort: number;

  public whatsappMicroUrl: string;

  public elastic: {
    cloudId: string;
    host: string;
    password: string;
    username: string;
  };

  public rsa: {
    private: string;
  };

  public payeverCNAME: string;

  public payeverIP: string;

  public appointmentsDomain: string;
}
