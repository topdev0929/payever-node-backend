import { UnauthorizedException } from '@nestjs/common';

export class UserRevokedException extends UnauthorizedException {
  public readonly message: string = 'User is revoked due to inactivity for last 6 months';
  public readonly reason: string = 'REASON_NOT_APPROVED';
}
