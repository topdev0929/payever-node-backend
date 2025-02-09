import { Document } from 'mongoose';

import { BlockedUserInterface } from '../interfaces';

export interface BlockedUserDocument extends BlockedUserInterface, Document {
}
