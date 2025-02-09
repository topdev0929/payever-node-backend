import { Document } from 'mongoose';
import { TrustedDomainInterface } from '../interfaces';

export interface TrustedDomainModel extends Document, TrustedDomainInterface {

}
