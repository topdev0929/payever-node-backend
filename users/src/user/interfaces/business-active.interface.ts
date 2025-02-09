import { User as UserInterface } from '../schemas/user.schema';
import { BusinessInterface } from './business.interface';

export interface BusinessActiveInterface extends Document {
  business?: BusinessInterface;
  businessId: string;
  owner: string | UserInterface;
}
