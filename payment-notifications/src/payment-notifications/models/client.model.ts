import { Document } from 'mongoose';
import { ClientInterface } from '../interfaces';

export interface ClientModel extends ClientInterface, Document { }
