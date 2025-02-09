import { BrowserInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface BrowserModel extends BrowserInterface, Document { }
