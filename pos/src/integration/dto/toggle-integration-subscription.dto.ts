import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ToggleIntegrationSubscriptionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public businessId: string;
}
