export class UserOnlineStateDto {
  public userId: string;
  public type: 'user' | 'guest';
  public name: string;
}
