import { ApiProperty } from '@nestjs/swagger';

export class OAuthRequestDto {
  @ApiProperty()
  public client_id: string;

  @ApiProperty()
  public client_secret: string;

  @ApiProperty()
  public grant_type: string;

  @ApiProperty()
  public scope: string;
}
