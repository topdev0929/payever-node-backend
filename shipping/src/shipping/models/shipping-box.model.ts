import { ShippingBoxInterface } from '../interfaces';
import { Document } from 'mongoose';
import { IntegrationModel } from '../../integration';
import { BusinessModel } from '../../business';

export interface ShippingBoxModel extends ShippingBoxInterface, Document {
    integration?: IntegrationModel | string;
    business?: BusinessModel | string;
}
