import { ActionIntegrationInterface } from './action-integration.interface';

export interface ActionInterface {
  method: string;
  name: string;
  orderId?: number;
  ifTrue?: string;
  url: string;
  registerSteps?: string[];
  payload?: any;
  capture?: any;
  returns?: any;
  integration?: ActionIntegrationInterface;
  priority?: number;
}
