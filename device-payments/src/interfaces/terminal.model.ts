import { Document } from 'mongoose';
import { TerminalInterface } from './terminal.interface';

/** @deprecated */
export interface TerminalModel extends TerminalInterface, Document {
  _id: any;
}
