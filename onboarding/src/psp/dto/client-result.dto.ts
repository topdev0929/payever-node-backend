import { ApiProperty } from '@nestjs/swagger';

export class ClientResultDto {
  @ApiProperty()
  public business_id: string;

  @ApiProperty()
  public client_id: string;

  @ApiProperty()
  public client_secret: string;

  @ApiProperty()
  public integrations?: { [key: string]: any };
}
