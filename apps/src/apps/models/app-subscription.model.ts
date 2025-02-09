import { Document } from 'mongoose';

import { AppSubscriptionInterface } from '../interfaces';

export interface AppSubscriptionModel extends AppSubscriptionInterface, Document { }
