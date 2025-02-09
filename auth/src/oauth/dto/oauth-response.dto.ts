import { ApiResponseProperty } from '@nestjs/swagger';

export class OAuthResponseDto {
  @ApiResponseProperty()
  public access_token: string;

  @ApiResponseProperty()
  public expires_in: number;

  @ApiResponseProperty()
  public token_type: string = 'bearer';

  @ApiResponseProperty()
  public scope: string = 'API_CREATE_PAYMENT';

  @ApiResponseProperty()
  public refresh_token: string;
}
