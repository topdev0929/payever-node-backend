import { Document } from 'mongoose';

import { ChatInviteInterface } from '../interfaces';

export interface ChatInviteDocument extends ChatInviteInterface, Document { }
