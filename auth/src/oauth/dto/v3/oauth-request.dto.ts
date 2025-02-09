import { ApiProperty } from '@nestjs/swagger';
import { ScopesEnum } from '../../../common';

export class V3OAuthRequestDto {
  @ApiProperty()
  public client_id: string;

  @ApiProperty()
  public client_secret: string;

  @ApiProperty()
  public grant_type: string;

  @ApiProperty()
  public business_id?: string;

  @ApiProperty()
  public scopes: ScopesEnum[];
}
