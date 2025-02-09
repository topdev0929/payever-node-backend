import { IntegrationReviewInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface IntegrationReviewModel extends IntegrationReviewInterface, Document { }
