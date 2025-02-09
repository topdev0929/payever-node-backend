import { Document } from 'mongoose';
import { CustomAccessInterface } from '../intefaces';

export interface CustomAccessModel extends CustomAccessInterface, Document { }
