export class HeadersHolderDto {
  public token?: string;
  public userAgent?: string;
  public idempotencyKey?: string;
  public forceRetryKey?: string;
}
