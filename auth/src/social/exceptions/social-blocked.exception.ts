import { UnauthorizedException } from '@nestjs/common';

export class SocialBlockedException extends UnauthorizedException {
  public readonly message: string = 'This social account has been blocked by user.';
  public readonly reason: string = 'REASON_SOCIAL_ACCOUNT_BLOCKED';
}
