import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ConnectDisplayOptionsInterface } from '../interfaces/connect-display-options.interface';
import { InstallationOptionsInterface } from '../interfaces';

export class ConnectIntegrationEventDto {
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @IsString()
  @IsNotEmpty()
  public category: string;

  @IsString()
  @IsOptional()
  public connect: any;

  @IsString()
  @IsOptional()
  public displayOptions: ConnectDisplayOptionsInterface;

  @IsString()
  @IsOptional()
  public installationOptions: InstallationOptionsInterface;

  @IsString()
  @IsOptional()
  public name: string;
}
