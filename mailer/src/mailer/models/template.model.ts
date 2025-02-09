import { Template } from '../interfaces';
import { Document } from 'mongoose';

export interface TemplateModel extends Template, Document { }
