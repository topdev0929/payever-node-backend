import { Document } from 'mongoose';
import { MetricInterface } from '../interfaces';

export interface MetricModel extends MetricInterface, Document { }
