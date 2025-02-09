import { ApiResponseProperty } from '@nestjs/swagger';

import { ScopesEnum } from '../../../common';

export class V3OAuthResponseDto {
  @ApiResponseProperty()
  public access_token: string;

  @ApiResponseProperty()
  public expires_in: number;

  @ApiResponseProperty()
  public token_type: string = 'bearer';

  @ApiResponseProperty()
  public scopes: ScopesEnum[];

  @ApiResponseProperty()
  public refresh_token: string;
}
