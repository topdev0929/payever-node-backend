import { Document } from 'mongoose';

import { OrganizationInterface } from '../interfaces';

export interface OrganizationModel extends OrganizationInterface, Document { }
