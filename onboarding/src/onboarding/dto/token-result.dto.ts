import { ApiProperty } from '@nestjs/swagger';

/**
 * @see nest-kit/src/auth/model/tokens-result.model.ts
 */
export class TokenResultDto {
  @ApiProperty()
  public accessToken: string;

  @ApiProperty()
  public refreshToken: string;
}
