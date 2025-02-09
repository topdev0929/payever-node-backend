import { Document } from 'mongoose';

import { ArchivedTransactionInterface } from '../interfaces';

export interface ArchivedTransactionModel extends ArchivedTransactionInterface, Document {
}
