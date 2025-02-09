import { Exclude } from 'class-transformer';
import { ActionApiCallInterface } from '../interfaces';

@Exclude()
export class ActionApiCallDto implements ActionApiCallInterface{
  public action: string;
  public businessId: string;
  public error: string;
  public executionTime: string;
  public paymentId: string;
  public requestData: any;
  public status: string;
}
