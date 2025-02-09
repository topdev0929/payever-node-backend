import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IntegrationConnectFormActionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public actionEndpoint: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public initEndpoint: string;
}
