export interface OAuthTokenInterface {
  businessIds?: string[];
  clientId?: string;
  executionTime?: number;

  readonly createdAt?: Date;
}
