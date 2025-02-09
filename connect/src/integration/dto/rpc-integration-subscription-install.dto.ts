import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RpcIntegrationSubscriptionInstallDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public integrationName: string;
}
