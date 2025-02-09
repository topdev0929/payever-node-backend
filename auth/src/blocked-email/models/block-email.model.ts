import { Document } from 'mongoose';
import { BlockEmailInterface } from '../interfaces/block-email.interface';

export interface BlockEmailModel extends BlockEmailInterface, Document { }
