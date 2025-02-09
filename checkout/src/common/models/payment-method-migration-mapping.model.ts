import { Document } from 'mongoose';
import { PaymentMethodMigrationMappingInterface } from '../interfaces';

export interface PaymentMethodMigrationMappingModel extends PaymentMethodMigrationMappingInterface, Document { }
