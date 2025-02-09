import { Document } from 'mongoose';
import { UserAccountInterface } from 'src/user';

export interface UserInterface extends Document {
    userAccount?: UserAccountInterface;
}
