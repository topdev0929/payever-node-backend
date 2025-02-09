import { Document } from 'mongoose';
import { CheckoutSettingsInterface } from '../interfaces';

export interface CheckoutSettingsModel extends CheckoutSettingsInterface, Document { }
