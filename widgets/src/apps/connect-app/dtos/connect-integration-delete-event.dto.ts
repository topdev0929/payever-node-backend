import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectIntegrationDeleteEventDto {
  @IsString()
  @IsNotEmpty()
  public integration: string;
}
