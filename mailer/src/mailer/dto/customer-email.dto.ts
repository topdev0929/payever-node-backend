import { ApplicationAccessStatusEnum } from '@pe/nest-kit';
import { ServerTypeEnum } from '../enum';

export class ApplicationAccessRequestDto {
  public business: {
    id: string;
    contactEmails: string[];
  };
  public customer: {
    id: string;
    first_name: string;
    email: string;
  };
  public owner: {
    id: string;
    first_name: string;
    email: string;
  };
  public applicationType: string;
  public applicationId: string;
  public status: ApplicationAccessStatusEnum;

  public serverType?: ServerTypeEnum;

}
