import { Positions, Status } from '../enum';

export interface PositionInterface {
  businessId: string;
  positionType: Positions;
  status: Status;
  inviteMailSent: boolean;
}
