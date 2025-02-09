import { Document } from 'mongoose';

import { IntegrationLinkInterface } from '../interfaces';

export interface IntegrationLinkDocument extends IntegrationLinkInterface, Document { }
