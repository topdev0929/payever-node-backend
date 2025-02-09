import { TerminalInterface } from './terminal.interface';
import { Document } from 'mongoose';

export interface TerminalModel extends TerminalInterface, Document {
}
