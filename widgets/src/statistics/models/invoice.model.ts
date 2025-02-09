import { Document } from 'mongoose';
import { InvoiceInterface } from '../interfaces';

export interface InvoiceModel extends InvoiceInterface, Document { }
