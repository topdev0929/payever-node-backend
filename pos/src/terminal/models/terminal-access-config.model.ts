import { Document } from 'mongoose';
import { TerminalAccessConfigInterface } from '../interfaces';
import { TerminalModel } from '../models';

export interface TerminalAccessConfigModel extends TerminalAccessConfigInterface, Document {
  terminal: TerminalModel;
}
