import { HttpMethodsEnum } from '../../enums';

export interface InfoBoxActionInterface {
  actionId: string;
  request?: {
    url: string;
    method: HttpMethodsEnum;
  };
  classes?: string;
  text: string;
}
