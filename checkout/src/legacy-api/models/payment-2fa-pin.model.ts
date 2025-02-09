import { Document } from 'mongoose';
import { Payment2faPinInterface } from '../interfaces';

export interface Payment2faPinModel extends Payment2faPinInterface, Document { }
