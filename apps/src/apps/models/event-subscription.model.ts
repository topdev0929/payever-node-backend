import { Document } from 'mongoose';

import { EventSubscriptionInterface } from '../interfaces';

export interface EventSubscriptionModel extends EventSubscriptionInterface, Document { }
