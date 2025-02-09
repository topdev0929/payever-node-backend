import { Document } from 'mongoose';
import { TemplateInterface } from '../interfaces';

export interface TemplateModel extends TemplateInterface, Document { }
