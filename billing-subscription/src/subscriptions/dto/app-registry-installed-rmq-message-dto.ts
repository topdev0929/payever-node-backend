import { IsNotEmpty, IsString } from 'class-validator';

export class AppRegistryInstalledRmqMessageDto {
  @IsString()
  @IsNotEmpty()
  public businessId: string;
  @IsString()
  @IsNotEmpty()
  public code: string;
}
