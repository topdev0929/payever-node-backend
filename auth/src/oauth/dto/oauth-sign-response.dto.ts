export class OAuthSignResponseDto {
  public messages: SignedMessageInterface[];
}

export interface SignedMessageInterface {
  id: string;
  signature: string;
}
