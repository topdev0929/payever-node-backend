import { PosTerminalInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface PosTerminalModel extends  PosTerminalInterface, Document { }
