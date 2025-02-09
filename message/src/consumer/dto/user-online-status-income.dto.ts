import { UserOnlineStateDto } from '../../ws/dto';
export class UserOnlineStatusIncomeDto {
  public businessId: string;
  public onlines: UserOnlineStateDto[];
}
