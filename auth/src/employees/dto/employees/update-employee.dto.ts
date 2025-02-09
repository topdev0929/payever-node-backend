import { AclInterface } from '@pe/nest-kit';

import { Positions, Status } from '../../enum';
import { UpdateEmployeeInterface } from '../../interfaces';

export class UpdateEmployeeDto implements UpdateEmployeeInterface {
  public position: Positions;
  public acls: AclInterface[];
  public userId?: string;
  public status: Status;
}
