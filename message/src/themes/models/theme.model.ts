import { Document } from 'mongoose';

import { BubbleInterface } from '../interfaces';

export interface BubbleModel extends BubbleInterface, Document {
}
