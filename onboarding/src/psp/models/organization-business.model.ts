import { Document } from 'mongoose';

import { OrganizationBusinessInterface } from '../interfaces';

export interface OrganizationBusinessModel extends OrganizationBusinessInterface, Document { }
