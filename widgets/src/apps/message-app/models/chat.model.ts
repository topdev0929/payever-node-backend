import { ChatInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface ChatModel extends  ChatInterface, Document { }
